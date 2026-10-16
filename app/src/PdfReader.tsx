import React, { useEffect, useRef, useState } from 'react';
import catalog from './data/catalog.json';
import { asset } from './assets';
import { profile, read, write, recordSkip } from './engine';

export function Pdf({ id, page = 1, onSkip }: { id: string; page?: number; onSkip?: () => void }) {
  const entry = catalog.documents.find(d => d.id === id);
  const file = asset(id);
  const uid = profile().uid;
  const key = `kemet_pdf_resume_${uid}_${id}`;
  const [current, setCurrent] = useState(() => Math.max(1, page > 1 ? page : read<number>(key, 1)));
  const [total, setTotal] = useState(entry?.pageCount || 1);
  const [pdf, setPdf] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(800);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [rendered, setRendered] = useState(0);
  const [retry, setRetry] = useState(0);
  const [landscape, setLandscape] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const rendering = useRef<any>(null);
  useEffect(() => {
    const el = viewport.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(entries => setWidth(Math.max(200, entries[0].contentRect.width - 24)));
    observer.observe(el); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const change = () => setFullscreen(document.fullscreenElement === shell.current);
    document.addEventListener('fullscreenchange', change);
    return () => document.removeEventListener('fullscreenchange', change);
  }, []);
  useEffect(() => {
    setCurrent(Math.max(1, page > 1 ? page : read<number>(key, 1)));
    setTotal(entry?.pageCount || 1); setPdf(null); setRendered(0); setZoom(1);
  }, [id, key]);
  useEffect(() => { if (Number.isFinite(page) && page > 0) setCurrent(Math.min(page, total)); }, [page]);
  useEffect(() => { if (pdf) write(key, current); }, [pdf, current, key]);
  useEffect(() => {
    let disposed = false;
    let task: any;
    setLoading(true); setError(''); setRendered(0);
    (async () => {
      try {
        const api = await import('pdfjs-dist');
        api.GlobalWorkerOptions.workerSrc = '/vendor/pdfjs/pdf.worker.min.mjs';
        task = api.getDocument({ url: file!.path, cMapUrl: '/vendor/pdfjs/cmaps/', cMapPacked: true, standardFontDataUrl: '/vendor/pdfjs/standard_fonts/' });
        const loaded = await task.promise;
        if (disposed) return;
        setTotal(loaded.numPages); setCurrent(p => Math.min(Math.max(1, p), loaded.numPages)); setPdf(loaded);
      } catch (e: any) { if (!disposed) { setError('The original PDF could not be opened. Retry, or download the original below.'); setLoading(false); } }
    })();
    return () => { disposed = true; rendering.current?.cancel(); task?.destroy()?.catch(() => {}); };
  }, [file?.path, retry]);
  useEffect(() => {
    if (!pdf) return;
    let disposed = false;
    let task: any;
    setLoading(true); setError(''); setRendered(0);
    (async () => {
      try {
        // Await the cancelled render before reusing the same canvas.
        if (rendering.current) { rendering.current.cancel(); try { await rendering.current.promise; } catch {} }
        const p = await pdf.getPage(Math.min(Math.max(1, current), pdf.numPages));
        if (disposed || !canvas.current) return;
        const base = p.getViewport({ scale: 1 }); setLandscape(base.width > base.height);
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const view = p.getViewport({ scale: Math.min(width / base.width, 1.6) * zoom * ratio });
        const c = canvas.current; c.width = Math.ceil(view.width); c.height = Math.ceil(view.height);
        c.style.width = `${view.width / ratio}px`; c.style.height = `${view.height / ratio}px`;
        const context = c.getContext('2d'); if (!context) throw new Error('Canvas unavailable');
        task = p.render({ canvasContext: context, viewport: view }); rendering.current = task;
        await task.promise;
        if (!disposed) { setRendered(current); setLoading(false); }
      } catch (e: any) { if (!disposed && e?.name !== 'RenderingCancelledException') { setError('This page could not be rendered. Retry or download the original PDF.'); setLoading(false); } }
    })();
    return () => { disposed = true; task?.cancel(); };
  }, [pdf, current, zoom, width]);
  const jump = (n: number) => { if (Number.isFinite(n)) setCurrent(Math.min(Math.max(1, Math.trunc(n)), total)); };
  async function toggleFullscreen() {
    try { if (document.fullscreenElement === shell.current) await document.exitFullscreen(); else await shell.current?.requestFullscreen(); }
    catch { setError('Fullscreen is unavailable here. You can keep reading in this view.'); }
  }
  if (!file?.available) return <p role="status">Original PDF unavailable: {id}</p>;
  return <section ref={shell} className={`pdf-study-viewer panel ${landscape ? 'orientation-landscape' : 'orientation-portrait'} ${fullscreen ? 'fullscreen' : ''}`} aria-label="Original PDF reader">
    <div className="pdf-header"><div><h3>{entry?.originalFilename || id}</h3><p>Original document · {total} pages · Text, artwork and fonts rendered directly from the PDF.</p></div>
      <div className="pdf-actions"><a href={file.path} download={entry?.originalFilename} className="download-btn">Download untouched original PDF</a><button onClick={toggleFullscreen}>{fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</button></div></div>
    <div className="pdf-toolbar"><div className="pagination-controls">
      <button disabled={current <= 1} onClick={() => jump(1)}>First page</button><button disabled={current <= 1} onClick={() => jump(current - 1)}>← Previous</button>
      <label>Page <input aria-label="PDF page number" type="number" min="1" max={total} value={current} onChange={e => jump(e.target.valueAsNumber)} className="page-input" /> of {total}</label>
      <button disabled={current >= total} onClick={() => jump(current + 1)}>Next →</button><button disabled={current >= total} onClick={() => jump(total)}>Last Page ({total})</button></div>
      <div className="zoom-controls"><button disabled={zoom <= .6} onClick={() => setZoom(z => Math.max(.6,z-.2))}>− Zoom</button><span>{Math.round(zoom*100)}%</span><button disabled={zoom >= 3} onClick={() => setZoom(z => Math.min(3,z+.2))}>+ Zoom</button><button onClick={() => setZoom(1)}>Fit width</button></div>
      {onSkip && <button onClick={() => { recordSkip(uid,crypto.randomUUID(),`${id}-page-${current}`,'source-2026-10-15','pdf_study'); onSkip(); }}>Skip activity (uncredited)</button>}
    </div>
    {error && <div role="alert"><p>{error}</p><button onClick={() => { setPdf(null); setRetry(n => n+1); }}>Retry PDF</button></div>}
    <div className="pdf-canvas-container" ref={viewport} aria-busy={loading}>
      <canvas ref={canvas} className="pdf-canvas" style={{ visibility: rendered === current ? 'visible' : 'hidden' }} aria-label={`Original PDF page ${current} of ${total}`} />
    </div>
    <p role="status" className="pdf-footer-status">{loading ? `Rendering page ${current}…` : rendered === current ? `Page ${current}/${total} rendered from original PDF` : 'Waiting for document'} · Position saved on this device.</p>
  </section>;
}
