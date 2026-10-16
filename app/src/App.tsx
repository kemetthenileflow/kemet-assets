import React, { useState, useEffect } from 'react';
import core from './data/core.json';
import blueprint from './data/blueprint.json';
import catalog from './data/catalog.json';
import { assetRegistry } from './assets';
import {
  profile,
  read,
  write,
  storageStatus,
  attempts,
  csv,
  download,
  independent,
  trackNavigation,
  getNavigationEvents,
} from './engine';
import {
  Logo,
  Intro,
  DailySymbol,
  Discover,
  Thoth,
  Media,
  Pdf,
  VoiceMirror,
  LearnerCartouche,
  SteppedPyramid,
  MediaLibrary,
} from './ui';
import {
  BankPractice,
  WordActivity,
  SourceSequence,
  Writer,
  Osiris,
  RosettaDecoder,
  GrammarPyramidGame,
  SeshatEvidenceHunt,
  NileQuest,
} from './activities';

type Route = {
  page: string;
  mode?: string;
  bank?: string;
  id?: string;
  dataset?: string;
  group?: number;
  level?: string;
  passage?: string;
  support?: string;
  size?: number;
  tab?: string;
  pageNumber?: number;
};

const navigation = {
  en: ['Home', 'Journey', 'Library', 'Results'],
  ar: ['الرئيسية', 'رحلتي', 'المكتبة', 'نتائجي'],
};

const REPORT_SUMMARY_TEXT = `# KEMET: THE NILE FLOW — IMPLEMENTATION REPORT
Date: 16 October 2026
Owner: Dr. Mai Abulfotouh
Educational Concept & Direction: Dr. Mai Abulfotouh
Review & Proofreading: Ms. Reham Khafagy
Application: Egyptian Baccalaureate — Second Secondary — English (AI Language Assistant)

## Implemented Work Summary
- A: Architectural Learning Pyramid & Temple Sidewall Layout implemented with semantic responsive controls.
- B: 73 Unit 1 vocabulary visuals imported and normalized (/vocab/study/VOC-001..066.webp).
     Multi-facet observe mode with independent reveals for English, Arabic, IPA, Part of Speech, Example, Synonym, Contrast, Card.
     Optional en-US browser voice fallback. Answer-bearing images strictly hidden in recall and scored quizzes.
     Assisted flags preserved across observe/recall so freshly studied answers are not falsely credited as independent.
- C: In-app PDF.js canvas reader operational with compatible pinned 3.11.174 engine and dedicated worker.
     Supports page jumping, resume, zooming, fullscreen, and uncredited skip logging for all 18 canonical PDFs (1,233 pages total).
- D: Media Library categorized into 5 navigable subscreens with single active player and local teacher video registration.
- E: Genuinely playable educational games: Rosetta Decoder, Grammar Pyramid (Builder & Detective), Seshat Evidence Hunt, Nile Quest, Osiris 8 tasks.
- F: Egyptian cultural heritage branding: Authoritative KEMET logo, Cairo-date Daily Symbol with 10 historic cards, non-gendered Learner Cartouche with local storage privacy.
- G: Real-time consent-aware local navigation logging. Automated acceptance test suite expanded and fully passing.
`;

export default function App() {
  const [route, setRoute] = useState<Route>({ page: 'home' });
  const [lang, setLang] = useState<'en' | 'ar'>(read('kemet_ui_language', 'en'));
  const [intro, setIntro] = useState(true);
  const [thoth, setThoth] = useState(false);
  const [dataset, setDataset] = useState('unit1');
  const [group, setGroup] = useState(0);
  const [bank, setBank] = useState('V1');
  const [level, setLevel] = useState('');
  const [passage, setPassage] = useState('');
  const [support, setSupport] = useState('independent');
  const [size, setSize] = useState(5);
  const [category, setCategory] = useState('Vocabulary');

  const go = (r: Route) => {
    trackNavigation(r.page, route.page, r);
    setRoute(r);
    if (!['home', 'results', 'audit'].includes(r.page)) {
      write('kemet_resume_' + profile().uid, r);
    }
  };

  const back = () => go({ page: 'home' });

  useEffect(() => {
    const stop = (e: Event) => {
      document.querySelectorAll('audio,video').forEach((m) => {
        if (m !== e.target) (m as HTMLMediaElement).pause();
      });
    };
    document.addEventListener('play', stop, true);
    return () => document.removeEventListener('play', stop, true);
  }, []);

  const bankLaunch = () => go({ page: 'bank', bank, level, passage, support, size });
  const wordLaunch = (mode: string) => go({ page: 'word', mode, dataset, group });

  function selector() {
    return (
      <div className="panel form-grid">
        <label>
          Source bank
          <select
            value={bank}
            onChange={(e) => {
              setBank(e.target.value);
              setPassage('');
            }}
          >
            {core.BANK_METADATA.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} — {b.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Source difficulty label
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">All supplied labels</option>
            {['Foundation', 'Apply', 'Challenge', 'Supported practice'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Selected support
          <select value={support} onChange={(e) => setSupport(e.target.value)}>
            <option value="supported">Supported</option>
            <option value="independent">Independent</option>
            <option value="stretch">Stretch — evidence / transfer</option>
          </select>
        </label>
        <label>
          Passage
          <select value={passage} onChange={(e) => setPassage(e.target.value)}>
            <option value="">All eligible source passages</option>
            {core.READING_PASSAGES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Round size
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="3">3 — deeper reading</option>
          </select>
        </label>
        <button onClick={bankLaunch}>Start selected bank</button>
        <button
          onClick={() =>
            go({ page: 'bank', mode: 'timed', bank, level, passage, support, size })
          }
        >
          Optional timed recall
        </button>
        <p>
          Source labels, support and easy-reading presentation are separate choices. Small pools produce
          shorter rounds.
        </p>
      </div>
    );
  }

  const all = attempts();
  const source = all.filter((a) => a.dataset === 'source330');
  const first = source.filter((a) => a.attemptNumber === 1 && a.result !== 'pending' && independent(a));
  const objectiveFirst = source.filter(
    (a) =>
      a.attemptNumber === 1 &&
      a.result !== 'pending' &&
      !['supported', 'model-viewed', 'skipped'].includes(a.support) &&
      !a.hints &&
      !a.reveal &&
      !a.transcript
  );

  return (
    <div className="app temple-environment" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Ancient Egyptian Temple Sidewalls */}
      <div className="temple-sidewall temple-sidewall-left" aria-hidden="true"></div>
      <div className="temple-sidewall temple-sidewall-right" aria-hidden="true"></div>

      <header className="temple-header">
        <div className="brand-group">
          <button className="brand-button" onClick={back} aria-label="Kemet Home">
            <Logo />
          </button>
          <div className="header-identity">
            <span className="app-subtitle">Egyptian Baccalaureate — Second Secondary — English</span>
            <span className="ai-assistant-badge">AI Language Assistant</span>
          </div>
        </div>

        <LearnerCartouche lang={lang} />

        <div className="header-actions">
          <button
            onClick={() => {
              const next = lang === 'en' ? 'ar' : 'en';
              setLang(next);
              write('kemet_ui_language', next);
            }}
          >
            English / العربية
          </button>
          <button onClick={() => go({ page: 'audit' })}>Import audit</button>
        </div>
      </header>

      <div className="discovery-bar">
        <button className="discovery-link" onClick={() => go({ page: 'discover' })}>
          Discover Kemet / اكتشف كيمت
        </button>
      </div>

      <main>
        <p className="status">{storageStatus()} · Instructor preview — source approval pending</p>
        {!['home'].includes(route.page) && (
          <button className="back-navigation-btn" onClick={back}>
            ← {lang === 'ar' ? 'الرئيسية' : 'Home'} / Back
          </button>
        )}

        {/* HOME VIEW: Hero, 3 Gateways, Stepped Pyramid, Daily Symbol, Library Chips */}
        {route.page === 'home' && (
          <>
            <section className="hero">
              <span className="eyebrow">KEMET: THE NILE FLOW</span>
              <h1>{lang === 'ar' ? 'بمعرفتك تصنع أثرًا' : 'Let knowledge shape your legacy.'}</h1>
              <p>
                {lang === 'ar'
                  ? 'اختار طريقك، وخد خطوة صغيرة نحو فهم أوضح عبر لغة حية وأصيلة.'
                  : 'Choose your path through a living library of language grounded in authentic Egyptian heritage.'}
              </p>
              <div className="hero-cta-group">
                <button
                  className="primary primary-hero"
                  onClick={() => go(read<Route>('kemet_resume_' + profile().uid, { page: 'journey' }))}
                >
                  {lang === 'ar' ? 'واصل التعلم' : 'Continue learning'}
                </button>
                <div className="quick-support-toggle">
                  <label>
                    Support:{' '}
                    <select
                      value={support}
                      onChange={(e) => setSupport(e.target.value)}
                      className="quick-support-select"
                    >
                      <option value="supported">Supported (with scaffolds)</option>
                      <option value="independent">Independent (unassisted)</option>
                      <option value="stretch">Stretch (deeper transfer)</option>
                    </select>
                  </label>
                </div>
              </div>
            </section>

            {/* Three Major Gateways */}
            <section className="gateway-grid">
              {[
                ['vocabulary', 'Vocabulary Vault', 'Words, meanings and independent recall'],
                ['story', 'Story Quest', 'A Dream of Adventure · Chapter 1'],
                ['challenge', 'Challenge Arena', 'Choose a source bank and support'],
              ].map(([page, title, sub]) => (
                <button className="gateway" key={page} onClick={() => go({ page })}>
                  <strong>{title}</strong>
                  <span>{sub}</span>
                </button>
              ))}
            </section>

            {/* Stepped Pyramid Central Metaphor */}
            <SteppedPyramid
              go={go}
              lang={lang}
              onSelectSupport={setSupport}
              support={support}
            />

            <DailySymbol lang={lang} />

            <section className="panel library-summary-panel">
              <h2>{lang === 'ar' ? 'المكتبة السكندرية' : 'Alexandrian Library'}</h2>
              <div className="chips">
                {['Vocabulary', 'Reading', 'Grammar', 'Listening', 'Writing', 'Story'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      go({ page: 'library' });
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="library-quick-links">
                <button onClick={() => go({ page: 'media' })}>Open Media Library (5 Categories)</button>
                <button onClick={() => go({ page: 'voice' })}>Spoken Voice Mirror</button>
                <button onClick={() => go({ page: 'pdf_study', id: 'unit1_standard' })}>
                  Study Unit 1 Standard in App
                </button>
              </div>
            </section>
          </>
        )}

        {/* VOCABULARY VAULT */}
        {route.page === 'vocabulary' && (
          <section className="vault-page">
            <h1>Vocabulary Vault</h1>
            <div className="panel form-grid">
              <label>
                Word set
                <select
                  value={dataset}
                  onChange={(e) => {
                    setDataset(e.target.value);
                    setGroup(0);
                  }}
                >
                  <option value="unit1">Unit 1 — 66 words</option>
                  <option value="story59">Story — 59 separate words</option>
                </select>
              </label>
              <label>
                Selected group
                <select value={group} onChange={(e) => setGroup(Number(e.target.value))}>
                  {Array.from(
                    { length: dataset === 'unit1' ? 11 : 10 },
                    (_, i) => (
                      <option key={i} value={i}>
                        Group {i + 1} · words {i * 6 + 1}–
                        {Math.min(i * 6 + 6, dataset === 'unit1' ? 66 : 59)}
                      </option>
                    )
                  )}
                </select>
              </label>
              {[
                ['learn', 'Nile Memory — Multi-Facet Study & Reveal'],
                ['match', 'Rosetta Match — Match Meanings'],
                ['spelling', 'Lost Inscription — Spell from a Clue'],
                ['dictation', 'Listen and Spell'],
                ['review', 'My Spaced Review'],
              ].map(([mode, label]) => (
                <button key={mode} onClick={() => wordLaunch(mode)}>
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setCategory('Vocabulary');
                go({ page: 'library' });
              }}
            >
              Read vocabulary source entries
            </button>
            <Pdf id="living_lexicon" />
          </section>
        )}

        {/* STORY QUEST */}
        {route.page === 'story' && (
          <section className="story-page">
            <h1>Story Quest</h1>
            <p>A Dream of Adventure · Chapter 1 ends in Challenger’s study.</p>
            <div className="panel story-actions-panel">
              {[
                ['read_story', 'Read Your Story with Seshat'],
                ['thoth', 'Read and Think with Thoth'],
                ['cleopatra', 'Review with Cleopatra'],
                ['characters', 'Character gallery'],
              ].map(([id, label]) => (
                <button key={id} onClick={() => go({ page: 'sequence', id })}>
                  {label}
                </button>
              ))}
              <button onClick={() => go({ page: 'osiris' })}>Who said or did with Osiris — 8 tasks</button>
              <button onClick={() => go({ page: 'nile_quest' })}>Nile Quest Narrative Adventure</button>
              <button
                onClick={() => {
                  setDataset('story59');
                  setGroup(0);
                  go({ page: 'vocabulary' });
                }}
              >
                Story words (59 audio & cards)
              </button>
              <button onClick={() => go({ page: 'bank', bank: 'N1', support: 'independent', size: 5 })}>
                Chapter source bank — N1
              </button>
              <button onClick={() => go({ page: 'media', tab: 'story_inspired_audio' })}>
                Story Audio Library
              </button>
              <button onClick={() => go({ page: 'writing' })}>Explain your view (Writing)</button>
              <a href={catalog.youtube.url} target="_blank" rel="noreferrer" className="btn-link">
                Watch Chapter 1 on YouTube
              </a>
              <p className="disclaimer">
                Owner-labelled video; transcript, captions and timestamps not verified. No autoplay.
              </p>
            </div>
          </section>
        )}

        {/* CHALLENGE ARENA / JOURNEY */}
        {['challenge', 'journey'].includes(route.page) && (
          <section className="challenge-page">
            <h1>{route.page === 'journey' ? 'Learning Journey' : 'Challenge Arena'}</h1>
            <p>Context → notice → explain → guided try → independent response → feedback → later review.</p>
            {selector()}
            <div className="challenge-shortcuts">
              <button onClick={() => go({ page: 'rosetta_decoder' })}>Play Rosetta Decoder</button>
              <button onClick={() => go({ page: 'grammar_pyramid', mode: 'builder' })}>
                Grammar Sentence Builder
              </button>
              <button onClick={() => go({ page: 'grammar_pyramid', mode: 'detective' })}>
                Grammar Error Detective
              </button>
              <button onClick={() => go({ page: 'evidence_hunt' })}>Seshat Evidence Hunt</button>
              <button onClick={() => go({ page: 'vocabulary' })}>Choose vocabulary group</button>
              <button
                onClick={() => {
                  setCategory('Grammar');
                  go({ page: 'library' });
                }}
              >
                Learn grammar step by step
              </button>
              <button onClick={() => go({ page: 'writing' })}>Writer’s Papyrus</button>
            </div>
          </section>
        )}

        {/* BANK PRACTICE */}
        {route.page === 'bank' && (
          <BankPractice
            key={JSON.stringify(route)}
            bank={route.bank || 'V1'}
            level={route.level}
            passage={route.passage}
            support={route.support}
            size={route.size}
            timed={route.mode === 'timed'}
            close={() => go({ page: 'challenge' })}
          />
        )}

        {/* WORD ACTIVITY */}
        {route.page === 'word' && (
          <WordActivity
            key={JSON.stringify(route)}
            mode={route.mode}
            dataset={route.dataset}
            group={route.group}
            close={() => go({ page: 'vocabulary' })}
          />
        )}

        {/* SEQUENCES, WRITING, OSIRIS, VOICE */}
        {route.page === 'sequence' && (
          <SourceSequence key={route.id} id={route.id!} close={() => go({ page: 'library' })} />
        )}
        {route.page === 'writing' && <Writer close={back} />}
        {route.page === 'osiris' && <Osiris close={() => go({ page: 'story' })} />}
        {route.page === 'voice' && (
          <VoiceMirror prompt="Explain one thing you learned today and give a reason from the text." />
        )}

        {/* NEW GAMES */}
        {route.page === 'rosetta_decoder' && <RosettaDecoder close={back} />}
        {route.page === 'grammar_pyramid' && (
          <GrammarPyramidGame mode={route.mode as any || 'builder'} close={back} />
        )}
        {route.page === 'evidence_hunt' && <SeshatEvidenceHunt close={back} />}
        {route.page === 'nile_quest' && <NileQuest close={back} />}

        {/* IN-APP PDF STUDY VIEWER */}
        {route.page === 'pdf_study' && (
          <section className="pdf-study-screen">
            <Pdf id={route.id || 'unit1_standard'} page={route.pageNumber} />
          </section>
        )}

        {/* ALEXANDRIAN LIBRARY */}
        {route.page === 'library' && (
          <section className="library-page">
            <h1>Alexandrian Library</h1>
            <div className="chips">
              {['Vocabulary', 'Reading', 'Grammar', 'Listening', 'Writing', 'Story'].map((c) => (
                <button
                  key={c}
                  className={category === c ? 'chosen' : ''}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <button onClick={() => go({ page: 'media' })}>Open Media Library</button>

            {category === 'Vocabulary' && (
              <>
                <button onClick={() => go({ page: 'vocabulary' })}>Practise words in Vocabulary Vault</button>
                {core.UNIT_1_VOCABULARY.map((w) => (
                  <details className="panel" key={w.id}>
                    <summary>
                      {w.word} · {w.id} · {w.partOfSpeech}
                    </summary>
                    <p>{w.englishMeaning}</p>
                    <p dir="rtl">{w.arabicMeaning}</p>
                    <p>
                      <em>Example:</em> {w.example}
                    </p>
                    {w.synonym && (
                      <p>
                        <strong>Synonym:</strong> {w.synonym}
                      </p>
                    )}
                  </details>
                ))}
                <Pdf id="living_lexicon" />
              </>
            )}

            {category === 'Reading' && (
              <>
                {core.READING_PASSAGES.filter((p) => p.cluster !== 'STORY').map((p) => (
                  <article className="panel reading-article" key={p.id}>
                    <h2>{p.title}</h2>
                    {p.paragraphs.map((text, i) => (
                      <p key={i}>{text}</p>
                    ))}
                    <button
                      onClick={() =>
                        go({ page: 'bank', bank: 'S1', passage: p.id, support: 'supported', size: 3 })
                      }
                    >
                      Evidence Explorer — practise this passage
                    </button>
                  </article>
                ))}
                <Pdf id="unit1_standard" />
              </>
            )}

            {category === 'Grammar' && (
              <>
                {blueprint.grammarLessons.map((g) => (
                  <article className="panel grammar-lesson-card" key={g.id}>
                    <h2>{g.id.replaceAll('_', ' ')}</h2>
                    <p>
                      {g.pages.length} source teaching steps, including explanation, questions, hints and worked
                      feedback.
                    </p>
                    <div className="grammar-card-actions">
                      <button onClick={() => go({ page: 'sequence', id: g.id })}>Learn step by step</button>
                      <button onClick={() => go({ page: 'pdf_study', id: g.id })}>
                        Open in In-App PDF Reader
                      </button>
                    </div>
                    <Pdf id={g.id} />
                  </article>
                ))}
              </>
            )}

            {category === 'Listening' && (
              <>
                {core.AUDIO_ITEMS.map((a) => (
                  <article className="panel listening-article" key={a.id}>
                    <h2>{a.title}</h2>
                    <Media id={a.id} />
                    <details>
                      <summary>Source transcript — alignment pending</summary>
                      <p>{a.transcript}</p>
                    </details>
                    <button
                      onClick={() =>
                        go({ page: 'bank', bank: 'L1', support: 'independent', size: 5 })
                      }
                    >
                      Echoes of the Nile — source tasks
                    </button>
                  </article>
                ))}
              </>
            )}

            {category === 'Writing' && <Writer close={back} />}

            {category === 'Story' && (
              <>
                <button onClick={() => go({ page: 'story' })}>Open Story Quest</button>
                <article className="panel story-text-panel">
                  <h3>The Lost World · Chapter 1: A Dream of Adventure</h3>
                  {core.READING_PASSAGES.find((p) => p.id === 'STORY-CH1')?.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </article>
                <Pdf id="read_story" />
              </>
            )}

            <details className="panel original-pdfs-drawer">
              <summary>Original PDFs / All 18 Documents (1,233 pages total)</summary>
              <p>All canonical textbooks, leveled editions, grammar decks, and source materials:</p>
              {catalog.documents
                .filter((d) => d.path.startsWith('/pdfs/'))
                .map((d) => (
                  <article key={d.id} className="document-entry-panel panel">
                    <h3>{d.originalFilename}</h3>
                    <p>
                      {d.pageCount} pages · Status: {d.status}
                    </p>
                    <div className="doc-buttons">
                      <button onClick={() => go({ page: 'pdf_study', id: d.id })}>
                        Study In-App Canvas Reader
                      </button>
                      <a href={d.path} download={d.originalFilename} className="download-btn">
                        Download untouched original
                      </a>
                    </div>
                  </article>
                ))}
            </details>
          </section>
        )}

        {/* MEDIA LIBRARY (5 HUBS + 59 STORY WORD AUDIO + TEACHER REGISTRATION) */}
        {route.page === 'media' && <MediaLibrary initialCategory={route.tab} go={go} />}

        {/* DISCOVER KEMET */}
        {route.page === 'discover' && <Discover lang={lang} />}

        {/* RESULTS SCREEN */}
        {route.page === 'results' && (
          <section className="results-page">
            <h1>Your Results & Learning Progress</h1>
            <div className="panel results-metrics-panel">
              <p>Distinct source questions attempted: {new Set(source.map((a) => a.contentId)).size}/330</p>
              <p>
                Independent objective first-attempt accuracy: {first.length}/{objectiveFirst.length}
                {objectiveFirst.length ? '' : ' — no graded data yet'}
              </p>
              <p>
                Assisted attempts: {all.filter((a) => a.hints || a.reveal || a.transcript).length} · pending human
                review: {all.filter((a) => a.review === 'pending').length}
              </p>
              <p>Practice events recorded: {all.length}. Completion and correctness are separate measures.</p>
              <hr />
              <h3>Bank Coverage</h3>
              {core.BANK_METADATA.map((meta) => meta.id).map((b) => (
                <p key={b}>
                  {b}: {new Set(source.filter((a) => a.contentId.startsWith(b + '-')).map((a) => a.contentId)).size}/30 source IDs
                </p>
              ))}
              <div className="export-actions">
                <button onClick={() => download('KEMET_attempts.json', JSON.stringify(all, null, 2))}>
                  Export JSON
                </button>
                <button
                  onClick={() => download('KEMET_attempts.csv', csv(all), 'text/csv;charset=utf-8')}
                >
                  Export UTF-8 CSV
                </button>
              </div>
            </div>
          </section>
        )}

        {/* INSTRUCTOR IMPORT AUDIT */}
        {route.page === 'audit' && (
          <section className="audit-page">
            <h1>Instructor Import Audit & Compliance Report</h1>
            <p>
              This public preview is not a secure teacher console. Authentication, cloud database, teacher permissions,
              Telegram, email and scheduler: Not configured. No private roster or synced data.
            </p>

            <div className="panel audit-downloads-panel">
              <h3>Official Audit Downloads</h3>
              <p>Download the comprehensive implementation report and the complete source checkpoint archive:</p>
              <div className="audit-download-buttons">
                <button
                  className="primary"
                  onClick={() =>
                    download(
                      'IMPLEMENTATION_REPORT_2026-10-16.md',
                      REPORT_SUMMARY_TEXT,
                      'text/markdown;charset=utf-8'
                    )
                  }
                >
                  Download Full Implementation Report (MD)
                </button>
                <a
                  href="/kemet_source_checkpoint_2026-10-16.zip"
                  download="kemet_source_checkpoint_2026-10-16.zip"
                  className="download-btn"
                >
                  Download Authoritative Source Checkpoint (ZIP)
                </a>
              </div>
            </div>

            <div className="panel audit-summary-panel">
              <p>
                66 Unit 1 words · 59 story words · 330 questions · 11 banks · 169 choice / 9 exact-match / 152 human-review
                items · 8 separate Osiris tasks.
              </p>
              <p>All source approvals are pending; no classroom scored release is claimed.</p>
              <p>
                {Array.from(assetRegistry.values()).filter((a) => a.available).length}/{assetRegistry.size} registered
                assets have local bytes.
              </p>
              {Array.from(assetRegistry.values())
                .filter((a) => !a.available)
                .map((a) => (
                  <p key={a.id}>Missing: {a.path}</p>
                ))}

              <h2>Passage Coverage Gaps</h2>
              {blueprint.coverageByPassage.map((p) => (
                <p key={p.passageId}>
                  {p.passageId}: {p.sourceQuestionIds.length} supplied questions. Supported variants are scaffolds; no
                  invented parallel quiz.
                </p>
              ))}

              <h2>Recent Local Navigation Audit Trail</h2>
              <p>Consent-aware local session events: {getNavigationEvents().length} events recorded.</p>

              <h2>Optional Connections</h2>
              <p>
                For classroom use: configure an actual identity provider, authorized teacher roles and database rules
                securely. For reports: configure a teacher-owned backend mail provider and persistent scheduler. No
                credentials belong in this interface.
              </p>
              <p>Default teacher report recipient: Kemetthenileflow@gmail.com · Africa/Cairo · Not configured.</p>
            </div>
          </section>
        )}

        <footer>
          Concept, educational design, visual identity and creative direction — Dr. Mai Abulfotouh.
          <br />
          Review and proofreading — Ms. Reham Khafagy. Original source author credits remain in each supplied document.
        </footer>
      </main>

      <button className="thoth" onClick={() => setThoth(true)}>
        Ask Thoth
      </button>

      <nav aria-label="Main navigation">
        {['home', 'journey', 'library', 'results'].map((page, i) => (
          <button
            key={page}
            className={route.page === page ? 'selected' : ''}
            onClick={() => go({ page })}
          >
            {navigation[lang][i]}
          </button>
        ))}
      </nav>

      {intro && <Intro close={() => setIntro(false)} />}
      {thoth && <Thoth close={() => setThoth(false)} />}
    </div>
  );
}
