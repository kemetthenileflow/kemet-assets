import React, { useState, useEffect } from 'react';
import { SYMBOL_CARDS, SymbolCard, getCardByNumber, getRandomCard } from './data/symbolCards';
import { read, write } from './engine';
import { KemetIcon } from './components/KemetIcon';

export function SymbolDiscover({
  lang = 'en',
  go,
}: {
  lang?: 'en' | 'ar';
  go: (route: { page: string; [k: string]: any }) => void;
}) {
  const [currentNum, setCurrentNum] = useState<number>(() => {
    return read<number>('kemet_last_symbol_num', 1);
  });
  const [history, setHistory] = useState<number[]>(() => {
    return read<number[]>('kemet_symbol_discoveries', [1]);
  });
  const [showGrid, setShowGrid] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const card: SymbolCard = getCardByNumber(currentNum) || SYMBOL_CARDS[0];

  useEffect(() => {
    write('kemet_last_symbol_num', currentNum);
    if (!history.includes(currentNum)) {
      const nextHist = [currentNum, ...history].slice(0, 31);
      setHistory(nextHist);
      write('kemet_symbol_discoveries', nextHist);
    }
    setImgError(false);
  }, [currentNum]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'Escape') {
        setShowGrid(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentNum]);

  const prev = () => {
    const nextIdx = currentNum === 1 ? SYMBOL_CARDS.length : currentNum - 1;
    setCurrentNum(nextIdx);
  };

  const next = () => {
    const nextIdx = currentNum === SYMBOL_CARDS.length ? 1 : currentNum + 1;
    setCurrentNum(nextIdx);
  };

  const discoverAnother = () => {
    const randomCard = getRandomCard(currentNum);
    setCurrentNum(randomCard.cardNumber);
  };

  const categories = ['all', ...Array.from(new Set(SYMBOL_CARDS.map((c) => c.category)))];

  const filteredCards =
    categoryFilter === 'all'
      ? SYMBOL_CARDS
      : SYMBOL_CARDS.filter((c) => c.category === categoryFilter);

  return (
    <section className="symbol-discover-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Breadcrumb & Controls */}
      <div className="symbol-discover-header">
        <div className="symbol-header-left">
          <button
            className="symbol-home-btn"
            onClick={() => go({ page: 'home' })}
            aria-label="Back to Home"
          >
            <KemetIcon name="home" size={16} />
            <span>← {lang === 'ar' ? 'الرئيسية' : 'Back to Home'}</span>
          </button>
          <span className="symbol-counter">
            {lang === 'ar'
              ? `بطاقة ${card.cardNumber} من ${SYMBOL_CARDS.length}`
              : `Card ${card.cardNumber} of ${SYMBOL_CARDS.length}`}
          </span>
        </div>

        <div className="symbol-header-right">
          <button
            className={`symbol-grid-toggle-btn ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? (
              <>
                <KemetIcon name="close" size={16} />
                <span>{lang === 'ar' ? 'إغلاق المعرض ✕' : 'Close Gallery ✕'}</span>
              </>
            ) : (
              <>
                <KemetIcon name="cartouche" size={16} />
                <span>{lang === 'ar' ? 'معرض البطاقات الـ ٣١ ☷' : 'All 31 Cards ☷'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Single Card Viewer */}
      {!showGrid ? (
        <div className="symbol-card-viewer">
          {/* Main Card Frame */}
          <div className="symbol-card-frame">
            <div className="symbol-card-art-container">
              {!imgError ? (
                <img
                  src={card.path}
                  alt={`${card.title} — ${card.arabicTitle}`}
                  className="symbol-card-original-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="symbol-card-placeholder">
                  <div className="placeholder-watermark" aria-hidden="true">
                    𓋹 𓊹 𓈖
                  </div>
                  <span className="placeholder-card-number">#{card.cardNumber.toString().padStart(2, '0')}</span>
                  <h3 className="placeholder-title">{card.title}</h3>
                  <h4 className="placeholder-arabic-title" dir="rtl">{card.arabicTitle}</h4>
                  <div className="placeholder-category-pill">{card.category}</div>
                  <p className="placeholder-education-text">{card.educationalText}</p>
                  <div className="placeholder-checksum-note">
                    <code>{card.path}</code>
                    <span className="placeholder-awaiting-badge">
                      {lang === 'ar' ? 'بانتظار مزامنة ملف الصورة الأصلي' : 'Original PNG card awaiting server sync'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Educational Meta Panel */}
            <div className="symbol-card-meta-panel">
              <div className="symbol-category-badge">{card.category}</div>
              <h2 className="symbol-title">{card.title}</h2>
              <h3 className="symbol-arabic-title" dir="rtl">{card.arabicTitle}</h3>
              <p className="symbol-educational-text">{card.educationalText}</p>
            </div>
          </div>

          {/* Interactive Navigation Controls */}
          <div className="symbol-controls-bar">
            <button
              className="symbol-nav-btn symbol-prev-btn"
              onClick={prev}
              aria-label="Previous card"
            >
              <KemetIcon name="back" size={16} />
              <span>{lang === 'ar' ? '← السابق' : '← Previous'}</span>
            </button>

            <button
              className="symbol-discover-btn"
              onClick={discoverAnother}
              aria-label="Discover another card"
            >
              <KemetIcon name="scarab" size={18} />
              <span>{lang === 'ar' ? 'اكتشف رمزًا آخر' : 'Discover Another'}</span>
            </button>

            <button
              className="symbol-nav-btn symbol-next-btn"
              onClick={next}
              aria-label="Next card"
            >
              <span>{lang === 'ar' ? 'التالي →' : 'Next →'}</span>
              <KemetIcon name="next" size={16} />
            </button>
          </div>

          {/* Recent Discoveries Reel */}
          {history.length > 1 && (
            <div className="symbol-recent-discoveries">
              <h4>{lang === 'ar' ? 'اكتشافاتك السابقة' : 'Your Recent Discoveries'}</h4>
              <div className="symbol-history-chips">
                {history.map((num) => {
                  const c = getCardByNumber(num);
                  if (!c) return null;
                  return (
                    <button
                      key={c.id}
                      className={`symbol-history-chip ${c.cardNumber === currentNum ? 'current' : ''}`}
                      onClick={() => setCurrentNum(c.cardNumber)}
                    >
                      #{c.cardNumber} {c.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 31 Cards Gallery Grid */
        <div className="symbol-cards-grid-view">
          <div className="symbol-grid-filter-bar">
            <span className="filter-label">{lang === 'ar' ? 'التصنيف:' : 'Category:'}</span>
            <div className="chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={categoryFilter === cat ? 'chosen' : ''}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat === 'all' ? (lang === 'ar' ? 'الكل (٣١)' : 'All (31)') : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="symbol-cards-grid">
            {filteredCards.map((c) => (
              <button
                type="button"
                aria-label={`${c.cardNumber}. ${c.title}`}
                key={c.id}
                className={`symbol-grid-item ${c.cardNumber === currentNum ? 'selected' : ''}`}
                onClick={() => {
                  setCurrentNum(c.cardNumber);
                  setShowGrid(false);
                }}
              >
                <div className="grid-item-thumbnail">
                  <span className="grid-item-num">#{c.cardNumber.toString().padStart(2, '0')}</span>
                  <img src={c.path} alt={c.title} loading="lazy" width={c.width} height={c.height} style={{width: "100%", height: "100%", objectFit: "contain"}} />
                </div>
                <div className="grid-item-info">
                  <h5>{c.title}</h5>
                  <span className="grid-item-ar" dir="rtl">{c.arabicTitle}</span>
                  <span className="grid-item-cat">{c.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
