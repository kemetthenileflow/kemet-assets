import React, { useState, useRef, useEffect } from 'react';
import core from './data/core.json';
import blueprint from './data/blueprint.json';
import catalog from './data/catalog.json';
import { asset, byPath, wordAsset } from './assets';
import {
  read,
  write,
  profile,
  updateProfile,
  attempts,
  storageStatus,
  recordSkip,
  getRegisteredVideos,
  registerVideo,
  removeRegisteredVideo,
  RegisteredVideo,
} from './engine';

export function Logo({ large = false }: { large?: boolean }) {
  const [error, setError] = useState(false);
  const a = asset('logo');
  return a?.available && !error ? (
    <img
      className={'logo ' + (large ? 'large' : '')}
      src={a.path}
      alt="KEMET: The Nile Flow — original authoritative logo"
      onError={() => setError(true)}
    />
  ) : (
    <span className="brand-fallback">KEMET: The Nile Flow</span>
  );
}

export function LearnerCartouche({
  lang = 'en',
  onEdit,
}: {
  lang?: 'en' | 'ar';
  onEdit?: () => void;
}) {
  const [p, setP] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(p.name);

  function save(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const updated = updateProfile(name);
    setP(updated);
    setEditing(false);
    onEdit?.();
  }

  return (
    <div
      className="cartouche-container"
      aria-label={lang === 'ar' ? 'خرطوشة المتعلم' : 'Learner Cartouche'}
    >
      <div className="cartouche-oval">
        <span className="cartouche-hieroglyph-mark" aria-hidden="true">𓏠</span>
        {editing ? (
          <form onSubmit={save} className="cartouche-form">
            <input
              autoFocus
              type="text"
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              className="cartouche-input"
              aria-label="Learner Name"
            />
            <button type="submit" className="cartouche-save-btn">
              ✓
            </button>
          </form>
        ) : (
          <button
            className="cartouche-name-btn"
            onClick={() => setEditing(true)}
            title={lang === 'ar' ? 'اضغط لتعديل الاسم محلياً' : 'Click to edit your local learner name'}
          >
            <span className="cartouche-name">{p.name}</span>
            <span className="cartouche-edit-icon" aria-hidden="true">✎</span>
          </button>
        )}
        <span className="cartouche-knot" aria-hidden="true"></span>
      </div>
      <span className="cartouche-status">{storageStatus()}</span>
    </div>
  );
}

export { SteppedPyramid } from './PyramidNavigator';

export { Pdf } from './PdfReader';

export function Media({
  id,
  path,
  onSupport,
  kind = 'audio',
}: {
  id: string;
  path?: string;
  onSupport?: (event: string) => void;
  kind?: 'audio' | 'video';
}) {
  const a = path ? { ...byPath(path), name: id } : asset(id);
  const ref = useRef<HTMLMediaElement>(null);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(0);
  const key = 'kemet_media_' + profile().uid + '_' + id;

  if (!a?.available) return <p role="status">Original {kind} unavailable: {id}</p>;

  const props = {
    ref: ref as any,
    src: a.path,
    controls: true,
    preload: 'none' as const,
    onLoadedMetadata: () => {
      if (ref.current) ref.current.currentTime = Math.min(read(key, 0), ref.current.duration || 0);
    },
    onPlay: () => {
      onSupport?.(count ? 'replay' : 'play');
      setCount(count + 1);
      document.querySelectorAll('audio,video').forEach((el) => {
        if (el !== ref.current) (el as HTMLMediaElement).pause();
      });
    },
    onPause: () => {
      if (ref.current) write(key, ref.current.currentTime);
    },
    onError: () => setError(true),
  };

  return (
    <div className="media">
      {kind === 'video' ? <video {...props} playsInline /> : <audio {...props} />}
      <label>
        Speed{' '}
        <select
          defaultValue="1"
          onChange={(e) => {
            if (ref.current) ref.current.playbackRate = Number(e.target.value);
          }}
        >
          <option value="0.8">0.8x</option>
          <option value="1">1x</option>
          <option value="1.2">1.2x</option>
        </select>
      </label>
      {error && (
        <p role="alert">
          Playback failed.{' '}
          <a href={a.path} target="_blank" rel="noreferrer">
            Open original file
          </a>
          <button
            onClick={() => {
              setError(false);
              ref.current?.load();
            }}
          >
            Retry
          </button>
        </p>
      )}
    </div>
  );
}

export function MediaLibrary({
  initialCategory = 'general_english_songs',
  go,
}: {
  initialCategory?: string;
  go: (route: any) => void;
}) {
  const [cat, setCat] = useState(initialCategory);
  const [subFilter, setSubFilter] = useState('all');
  const [storySearch, setStorySearch] = useState('');
  const [teacherVideos, setTeacherVideos] = useState<RegisteredVideo[]>(getRegisteredVideos);
  const [vTitle, setVTitle] = useState('');
  const [vCategory, setVCategory] = useState('Curriculum');
  const [vLesson, setVLesson] = useState('Unit 1');
  const [vUrl, setVUrl] = useState('');
  const [vCaption, setVCaption] = useState('');
  const [vMessage, setVMessage] = useState('');

  const hubs = [
    {
      id: 'general_english_songs',
      title: 'English with Music | راجع إنجليزيتك بالأغاني',
      subtitle: 'Grammar review songs and pronunciation recordings',
      items: catalog.media.filter((m) => m.category === 'general_english_songs'),
    },
    {
      id: 'curriculum_listening',
      title: 'Unit 1 Curriculum Listening | الاستماع المنهجي',
      subtitle: 'REC-01 and REC-04 linked to Ministry listening texts',
      items: catalog.media.filter((m) => m.category === 'curriculum_listening'),
    },
    {
      id: 'story_inspired_audio',
      title: 'A Dream of Adventure / Story Audio | صوتيات القصة',
      subtitle: 'Chapter 1 story atmosphere + 59 individual word recordings',
      items: catalog.media.filter((m) => m.category === 'story_inspired_audio'),
    },
    {
      id: 'entertainment_identity',
      title: 'Enjoy Kemet | الهوية المصرية والتحفيز',
      subtitle: 'Cultural motivation, Egyptian student pride & heritage music',
      items: catalog.media.filter((m) => m.category === 'entertainment_identity'),
    },
    {
      id: 'archive_unclassified',
      title: 'Instructor Archive | أرشيف المعلم',
      subtitle: 'MEDIA-10 kemet.mp3 unclassified pending teacher review',
      items: catalog.media.filter((m) => m.id === 'MEDIA-10'),
    },
  ];

  const currentHub = hubs.find((h) => h.id === cat) || hubs[0];

  function handleRegisterVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!vUrl.trim() || !vTitle.trim()) {
      setVMessage('Please enter a valid title and URL.');
      return;
    }
    const item = registerVideo({
      title: vTitle,
      category: vCategory,
      lesson: vLesson,
      url: vUrl,
      caption: vCaption,
    });
    setTeacherVideos([...teacherVideos, item]);
    setVTitle('');
    setVUrl('');
    setVCaption('');
    setVMessage('Video draft registered locally for preview.');
  }

  const storyAudioEntries = core.STORY_VOCABULARY_59.filter((s) => {
    if (!storySearch) return true;
    return s.word.toLowerCase().includes(storySearch.toLowerCase()) || s.meaning.toLowerCase().includes(storySearch.toLowerCase());
  });

  return (
    <section className="media-library-section">
      <div className="section-header">
        <h1>Media Library · المكتبة الصوتية والمرئية</h1>
        <p>Curated educational audio and media recordings (teacher review pending) with single active player.</p>
      </div>

      <div className="media-category-tiles">
        {hubs.map((h) => (
          <button
            key={h.id}
            className={`category-tile ${cat === h.id ? 'active' : ''}`}
            onClick={() => setCat(h.id)}
          >
            <strong>{h.title}</strong>
            <span>{h.subtitle}</span>
          </button>
        ))}
      </div>

      <div className="media-subscreen panel">
        <h2>{currentHub.title}</h2>
        <p className="subscreen-desc">{currentHub.subtitle}</p>

        {cat === 'general_english_songs' && (
          <div className="sub-filter-chips">
            <button
              className={subFilter === 'all' ? 'chosen' : ''}
              onClick={() => setSubFilter('all')}
            >
              All Songs (5)
            </button>
            <button
              className={subFilter === 'grammar' ? 'chosen' : ''}
              onClick={() => setSubFilter('grammar')}
            >
              Grammar Songs (MEDIA-07, 09, 13, 14)
            </button>
            <button
              className={subFilter === 'pronunciation' ? 'chosen' : ''}
              onClick={() => setSubFilter('pronunciation')}
            >
              Pronunciation (MEDIA-05)
            </button>
          </div>
        )}

        <div className="media-items-grid">
          {currentHub.items
            .filter((m) => {
              if (cat === 'general_english_songs') {
                if (subFilter === 'grammar') return ['MEDIA-07', 'MEDIA-09', 'MEDIA-13', 'MEDIA-14'].includes(m.id);
                if (subFilter === 'pronunciation') return m.id === 'MEDIA-05';
              }
              return true;
            })
            .map((m) => (
              <article className="media-card panel" key={m.id}>
                <div className="media-card-header">
                  <span className="badge">{m.id}</span>
                  <h3>{m.originalFilename.replace(/\.mp3$/, '')}</h3>
                  <span className="duration">
                    {Math.floor(m.durationSeconds / 60)}:
                    {String(Math.floor(m.durationSeconds % 60)).padStart(2, '0')}
                  </span>
                </div>
                <p className="media-note">
                  {m.curriculumAligned ? 'Curriculum aligned · listening review pending' : 'General enrichment audio'}
                </p>
                <Media id={m.id} />
                {m.id === 'REC-01' && (
                  <button
                    className="btn-small link-btn"
                    onClick={() => go({ page: 'bank', bank: 'L1', support: 'independent', size: 5 })}
                  >
                    Open Echoes of the Nile Listening Tasks (REC-01)
                  </button>
                )}
                {m.id === 'REC-04' && (
                  <button
                    className="btn-small link-btn"
                    onClick={() => go({ page: 'bank', bank: 'L1', support: 'supported', size: 5 })}
                  >
                    Open Echoes of the Nile Tasks (REC-04)
                  </button>
                )}
              </article>
            ))}
        </div>

        {cat === 'story_inspired_audio' && (
          <div className="story-words-sublibrary">
            <hr />
            <h3>59 Story-Word Individual Recordings Sub-Library</h3>
            <p>Authentic studio WAV pronunciation clips extracted from The Lost World Chapter 1.</p>
            <div className="search-bar">
              <input
                type="search"
                placeholder="Search story words (e.g. admire, fossils, zoologist)..."
                value={storySearch}
                onChange={(e) => setStorySearch(e.target.value)}
                className="story-search-input"
              />
            </div>
            <div className="story-words-grid">
              {storyAudioEntries.slice(0, 18).map((w) => {
                const clip = wordAsset(w.word);
                return (
                  <div className="story-word-card panel" key={w.id}>
                    <h4>{w.word}</h4>
                    <p className="meaning">{w.meaning}</p>
                    <p className="context">"{w.storyContext}"</p>
                    {clip?.available ? (
                      <Media id={clip.id} />
                    ) : (
                      <p className="status-note">Studio recording being processed</p>
                    )}
                  </div>
                );
              })}
            </div>
            {storyAudioEntries.length > 18 && (
              <p className="note">Showing first 18 of {storyAudioEntries.length} matching story word audio files.</p>
            )}
            <div className="youtube-advisory">
              <a href={catalog.youtube.url} target="_blank" rel="noreferrer" className="btn-link">
                Watch Chapter 1 on YouTube (Owner-supplied link)
              </a>
              <p className="disclaimer">Owner advisory: Transcript, captions and timestamps not verified. No autoplay.</p>
            </div>
          </div>
        )}

        <div className="teacher-video-section">
          <hr />
          <h3>Teacher Video Registration (Local Draft Preview)</h3>
          <p>
            Register externally hosted instructional video URLs (YouTube, Vimeo, direct MP4) with lesson metadata without storing large files in repository.
          </p>

          <form onSubmit={handleRegisterVideo} className="teacher-video-form form-grid">
            <label>
              Video Title
              <input
                value={vTitle}
                onChange={(e) => setVTitle(e.target.value)}
                placeholder="e.g. Relative Clauses in Modern Egyptian Literature"
              />
            </label>
            <label>
              Category
              <select value={vCategory} onChange={(e) => setVCategory(e.target.value)}>
                <option>Curriculum</option>
                <option>Grammar</option>
                <option>Culture & Heritage</option>
                <option>Story</option>
              </select>
            </label>
            <label>
              Lesson
              <input
                value={vLesson}
                onChange={(e) => setVLesson(e.target.value)}
                placeholder="e.g. Unit 1 Grammar Lesson 2"
              />
            </label>
            <label>
              Video URL (YouTube embed or direct video file)
              <input
                value={vUrl}
                onChange={(e) => setVUrl(e.target.value)}
                placeholder="https://www.youtube-nocookie.com/embed/... or https://..."
              />
            </label>
            <label className="full-width">
              Captions / Teacher notes
              <textarea
                value={vCaption}
                onChange={(e) => setVCaption(e.target.value)}
                placeholder="Add pedagogical objectives and timestamps..."
              />
            </label>
            <button type="submit" className="full-width">
              Register Video Draft
            </button>
            {vMessage && <p role="status">{vMessage}</p>}
          </form>

          {teacherVideos.length > 0 && (
            <div className="registered-videos-list">
              <h4>Registered Local Video Drafts ({teacherVideos.length})</h4>
              {teacherVideos.map((v) => (
                <div key={v.id} className="registered-video-card panel">
                  <div className="video-card-top">
                    <h5>{v.title}</h5>
                    <span className="badge">
                      {v.category} · {v.lesson}
                    </span>
                    <button
                      onClick={() => {
                        removeRegisteredVideo(v.id);
                        setTeacherVideos(getRegisteredVideos());
                      }}
                      className="btn-danger-small"
                    >
                      Remove
                    </button>
                  </div>
                  {v.url.includes('youtube') || v.url.includes('vimeo') ? (
                    <iframe
                      src={v.url}
                      title={v.title}
                      className="video-embed"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={v.url} controls playsInline className="video-player" />
                  )}
                  {v.caption && <p className="video-caption">{v.caption}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Intro({ close, replay = false }: { close: () => void; replay?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [manual, setManual] = useState(false);
  const [muted, setMuted] = useState(true);
  const a = asset('intro');

  useEffect(() => {
    const pref = read<string>('kemet_intro_mode', 'session');
    let seen = false;
    try {
      seen = !!sessionStorage.getItem('kemet_intro_seen');
    } catch {}
    if (
      !a?.available ||
      (!replay &&
        (pref === 'off' ||
          (pref === 'first' && read('kemet_intro_once', false)) ||
          (pref === 'session' && seen) ||
          matchMedia('(prefers-reduced-motion: reduce)').matches ||
          (navigator as any).connection?.saveData))
    ) {
      close();
      return;
    }
    try {
      sessionStorage.setItem('kemet_intro_seen', 'yes');
    } catch {}
    write('kemet_intro_once', true);
    if (replay && ref.current) { ref.current.muted = false; setMuted(false); }
    ref.current?.play().catch(() => setManual(true));
  }, []);

  return (
    <div role="dialog" aria-modal="true" aria-label="Kemet introduction" className="intro">
      <button autoFocus onClick={close}>
        Skip — Enter Home
      </button>
      <video ref={ref} src={a?.path} muted={muted} playsInline onEnded={close} onError={close} />
      {manual && <button onClick={() => ref.current?.play().catch(() => setManual(true))}>Play</button>}
      <button
        onClick={() => {
          if (ref.current) {
            ref.current.muted = false; setMuted(false);
            ref.current.play().catch(() => setManual(true));
          }
        }}
      >
        Play with sound
      </button>
      <button onClick={() => { const next=!muted;setMuted(next);if(ref.current)ref.current.muted=next; }}>{muted?'Unmute / تشغيل الصوت':'Mute / كتم الصوت'}</button>
      <label>
        Introduction{' '}
        <select
          defaultValue={read<string>('kemet_intro_mode', 'session')}
          onChange={(e) => write('kemet_intro_mode', e.target.value)}
        >
          <option value="session">Once per session</option>
          <option value="first">First visit only</option>
          <option value="off">Off</option>
        </select>
      </label>
    </div>
  );
}

export { VoiceMirror } from './VoiceMirror';

export function DailySymbol({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const day = Math.floor(Date.parse(date + 'T12:00:00Z') / 86400000);
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const c = blueprint.heritage.cards[(day + offset) % blueprint.heritage.cards.length];
  const key = 'kemet_trace_' + profile().uid + '_' + c.id;
  const [trace, setTrace] = useState(read(key, ''));

  useEffect(() => {
    setTrace(read(key, ''));
    setOpen(false);
  }, [key]);

  return (
    <section className="panel daily-symbol-panel" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h2>{lang === 'ar' ? 'رمزك المصري اليوم' : 'Your Egyptian Symbol Today'}</h2>
      <span className="badge">Instructor preview · awaiting review</span>
      <p>
        {profile().name} · {date} (Cairo Time)
      </p>
      <img className="medallion" src={c.artPath} alt={c.artLabel[lang]} />
      <h3>{c.title[lang]}</h3>
      <p>{c.hook[lang]}</p>
      <button onClick={() => setOpen(!open)}>{lang === 'ar' ? 'اكتشف الحكاية' : 'Discover the story'}</button>
      {open && (
        <>
          <p>{c.fact[lang]}</p>
          <p>{c.learningBridge[lang]}</p>
          <p>{c.tinyAction[lang]}</p>
          <details>
            <summary>Sources</summary>
            {c.sourceUrls.map((u) => (
              <a key={u} href={u} target="_blank" rel="noreferrer">
                {u}
              </a>
            ))}
          </details>
          <label>
            My Trace / أثري
            <textarea value={trace} onChange={(e) => setTrace(e.target.value)} />
          </label>
          <button onClick={() => write(key, trace)}>Save privately</button>
          <p>{storageStatus()}</p>
        </>
      )}
      <button onClick={() => setOffset(offset + 1)}>Explore another</button>
    </section>
  );
}

export function Discover({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const [mode, setMode] = useState('explore');
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [replay, setReplay] = useState(false);
  const e = blueprint.logoDiscovery.elements[index];

  return (
    <section className="discover-section panel">
      <h1>Discover the KEMET Logo</h1>
      <Logo large />
      <div className="discover-mode-buttons">
        {['explore', 'guess', 'assemble'].map((m) => (
          <button key={m} className={mode === m ? 'chosen' : ''} onClick={() => { setMode(m); setAnswer(''); }}>
            {m}
          </button>
        ))}
      </div>
      {mode === 'assemble' ? (
        <p>Assembly unavailable: clean separate logo parts have not been supplied. Explore the original artwork instead.</p>
      ) : (
        <>
          <div className="chips">
            {blueprint.logoDiscovery.elements.map((x, i) => (
              <button key={x.id} className={index === i ? 'chosen' : ''} onClick={() => { setIndex(i); setAnswer(''); }}>
                {x.title[lang]}
              </button>
            ))}
          </div>
          <article className="panel">
            <h2>{e.title[lang]}</h2>
            <p>Review status: pending</p>
            {mode === 'explore' ? (
              <>
                <h3>Historical context</h3>
                <p>{e.historicalContext[lang]}</p>
                <h3>Brand interpretation</h3>
                <p>{e.brandMeaning[lang]}</p>
                {e.sourceUrls.map((u) => (
                  <a key={u} href={u} target="_blank" rel="noreferrer">
                    Source
                  </a>
                ))}
              </>
            ) : (
              <>
                <p>{e.quiz[lang]}</p>
                {e.quiz.options.map((o) => (
                  <button key={o.id} onClick={() => setAnswer(o.id)}>
                    {o.text[lang]}
                  </button>
                ))}
                {answer && (
                  <p role="status">
                    {answer === e.quiz.correctId
                      ? 'Correct — this is the declared brand meaning.'
                      : 'Try another choice.'}
                  </p>
                )}
              </>
            )}
          </article>
        </>
      )}
      <button onClick={() => setReplay(true)}>Replay introduction</button>
      {replay && <Intro replay close={() => setReplay(false)} />}
    </section>
  );
}

const normalize = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[؟?.,!]/g, '')
    .trim();

export function searchSource(query: string) {
  const text = normalize(query);
  const words = text.split(/\s+/).filter(
    (w) => w.length > 2 && !['what', 'does', 'mean', 'يعني', 'إيه', 'ايه', 'the', 'explain'].includes(w)
  );
  const entries = [
    ...core.UNIT_1_VOCABULARY.map((v) => ({
      id: v.id,
      title: v.word,
      text: v.englishMeaning + ' ' + v.arabicMeaning + ' Example: ' + v.example,
      terms: v.word + ' ' + v.arabicMeaning,
    })),
    ...core.STORY_VOCABULARY_59.map((v) => ({
      id: v.id,
      title: v.word,
      text: v.meaning + ' ' + v.storyContext + ' · PDF page ' + v.sourcePdfPage,
      terms: v.word + ' ' + v.meaning,
    })),
    ...core.GRAMMAR_REFERENCES.map((g) => ({
      id: g.id,
      title: g.title,
      text: g.englishRules.join('\n') + '\n' + g.arabicRules.join('\n'),
      terms: g.title + ' ' + g.category,
    })),
    ...core.READING_PASSAGES.map((p) => ({
      id: p.id,
      title: p.title,
      text: p.paragraphs.join('\n'),
      terms: p.title,
    })),
  ];
  return entries.filter((e) => words.some((w) => normalize(e.terms).includes(w))).slice(0, 3);
}

export function Thoth({ close }: { close: () => void }) {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<ReturnType<typeof searchSource>>([]);
  const [message, setMessage] = useState('Source-bound local curriculum helper. No model connection.');

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Ask Thoth">
      <section className="panel">
        <button autoFocus onClick={close}>
          Close
        </button>
        <h2>Ask Thoth</h2>
        <p>Instructor preview: matches are recovered sources awaiting teacher approval.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const found = searchSource(query);
            setMatches(found);
            setMessage(
              found.length > 1
                ? 'Choose the relevant source below.'
                : found.length
                ? 'Matching source:'
                : 'No source match. Try a word, grammar topic, or ask your teacher.'
            );
          }}
        >
          <label>
            Search English / العربية
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What does decade mean?"
            />
          </label>
          <button>Search sources</button>
        </form>
        <p role="status">{message}</p>
        {matches.map((m) => (
          <details key={m.id}>
            <summary>
              {m.id} · {m.title} · pending
            </summary>
            <p>{m.text}</p>
          </details>
        ))}
        {[
          'Explain this source',
          'Show a source example',
          'Give a procedural hint',
          'Show another explanation',
          'Find my next review',
        ].map((label, i) => (
          <button
            key={label}
            onClick={() => {
              if (i === 4) {
                const a = attempts()
                  .filter((a) => a.result === 'incorrect')
                  .at(-1);
                setMessage(a ? 'Next review: ' + a.contentId : 'No incorrect response recorded yet. Choose a skill.');
              } else if (i === 2) {
                setMessage(
                  'Read the full sentence. Identify the subject, main verb and relationship before choosing. No answer key is revealed.'
                );
              } else if (i === 3) {
                setMessage('No additional approved alternative explanation is available yet. Choose a source or ask your teacher.');
              } else {
                setMessage('Choose a matching source above. Examples appear only in the source preview; approval is pending.');
              }
            }}
          >
            {label}
          </button>
        ))}
      </section>
    </div>
  );
}
