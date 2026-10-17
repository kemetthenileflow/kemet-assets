import React, { useState } from 'react';
import { KemetIcon, KemetIconName } from './components/KemetIcon';

const stages: {
  en: string;
  ar: string;
  paths: [string, string, Record<string, any>, KemetIconName][];
}[] = [
  {
    en: 'Start & orient',
    ar: 'ابدأ واكتشف',
    paths: [
      ['Ministry textbook · Part 1 · 172 pages', 'كتاب الوزارة الأصلي', { page: 'pdf_study', id: 'unit1_source' }, 'pdf'],
      ['All 18 original PDFs', 'كل ملفات PDF', { page: 'documents' }, 'library'],
      ['Unit 1 study guide', 'دليل دراسة الوحدة الأولى', { page: 'pdf_study', id: 'unit1_standard' }, 'reading'],
    ],
  },
  {
    en: 'Explore & understand',
    ar: 'استكشف وافهم',
    paths: [
      ['Vocabulary Vault', 'المفردات', { page: 'vocabulary' }, 'vocabulary'],
      ['Story Quest', 'القصة', { page: 'story' }, 'story'],
      ['Alexandrian Reading', 'القراءة', { page: 'library', category: 'Reading' }, 'reading'],
      ['Curriculum Listening', 'الاستماع المنهجي', { page: 'media', tab: 'curriculum_listening' }, 'listening'],
    ],
  },
  {
    en: 'Build & practise',
    ar: 'ابنِ وتدرّب',
    paths: [
      ['Grammar Sentence Builder', 'بناء الجمل', { page: 'grammar_pyramid', mode: 'builder' }, 'grammar'],
      ['Error Detective', 'محقق الأخطاء', { page: 'grammar_pyramid', mode: 'detective' }, 'search'],
      ['Grammar lessons', 'دروس القواعد', { page: 'library', category: 'Grammar' }, 'grammar'],
    ],
  },
  {
    en: 'Apply & express',
    ar: 'طبّق وعبّر',
    paths: [
      ['Voice Mirror', 'مرآة الصوت', { page: 'voice' }, 'mic'],
      ['Writer’s Papyrus', 'بردية الكاتب', { page: 'writing' }, 'writing'],
      ['Seshat Evidence Hunt', 'البحث عن الدليل', { page: 'evidence_hunt' }, 'writing'],
    ],
  },
  {
    en: 'Challenge & reflect',
    ar: 'تحدَّ وتأمّل',
    paths: [
      ['Challenge Arena', 'ساحة التحدي', { page: 'challenge' }, 'challenge'],
      ['Rosetta Decoder', 'فك شفرة رشيد', { page: 'rosetta_decoder' }, 'rosetta'],
      ['Nile Quest', 'رحلة النيل', { page: 'nile_quest' }, 'journey'],
      ['Osiris Challenges', 'تحديات أوزيريس', { page: 'osiris' }, 'challenge'],
      ['Progress', 'التقدم', { page: 'results' }, 'results'],
    ],
  },
];

export function SteppedPyramid({
  go,
  lang = 'en',
  onSelectSupport,
  support = 'independent',
}: {
  go: (r: any) => void;
  lang?: 'en' | 'ar';
  onSelectSupport?: (s: string) => void;
  support?: string;
}) {
  const [selected, setSelected] = useState(0);
  const ar = lang === 'ar';
  const stage = stages[selected];

  return (
    <section className="temple-path" aria-label="KEMET Learning Pyramid" dir={ar ? 'rtl' : 'ltr'}>
      <h2>{ar ? 'اختر خطوتك في هرم كيمت التعليمي' : 'Choose your learning step on the KEMET Pyramid'}</h2>
      <p>
        {ar
          ? 'مسار مقترح متدرج، وكل الأقسام والأنشطة مفتوحة من البداية دون قفل.'
          : 'A structured Egyptian mastery journey. Every section is open from the beginning.'}
      </p>

      <div className="temple-path-grid">
        <div className="stone-steps">
          {stages.map((s, i) => (
            <button
              key={s.en}
              style={{ width: `${100 - i * 11}%` }}
              aria-pressed={selected === i}
              aria-controls="pyramid-paths"
              onClick={() => setSelected(i)}
              className="pyramid-step-btn"
            >
              <span className="step-num">{i + 1}</span>{' '}
              <span className="step-label">{ar ? s.ar : s.en}</span>
            </button>
          ))}
        </div>

        <div id="pyramid-paths" className="stone-paths">
          <h3>
            <KemetIcon name="pyramids" size={20} />
            <span>{ar ? stage.ar : stage.en}</span>
          </h3>
          <div className="path-buttons-list">
            {stage.paths.map(([en, arabic, route, icon]) => (
              <button key={String(en)} onClick={() => go(route)} className="path-route-btn">
                <KemetIcon name={icon} size={18} />
                <span>{String(ar ? arabic : en)} →</span>
              </button>
            ))}
          </div>

          <label className="pyramid-support-label">
            {ar ? 'الدعم الاختياري:' : 'Optional support:'}{' '}
            <select value={support} onChange={(e) => onSelectSupport?.(e.target.value)}>
              <option value="supported">{ar ? 'مع مساعدة (مدعوم)' : 'Supported (scaffolded)'}</option>
              <option value="independent">{ar ? 'مستقل (بدون مساعدة)' : 'Independent'}</option>
              <option value="stretch">{ar ? 'توسّع (تحدٍ أعمق)' : 'Stretch (deeper transfer)'}</option>
            </select>
          </label>
        </div>
      </div>

      <details className="all-paths-dropdown">
        <summary>{ar ? 'عرض كل المسارات التعليمية مباشرة' : 'All learning paths directly'}</summary>
        <div className="all-paths">
          {stages.flatMap((s) => s.paths).map(([en, arabic, route, icon]) => (
            <button key={String(en)} onClick={() => go(route)}>
              <KemetIcon name={icon} size={15} />
              <span>{String(ar ? arabic : en)}</span>
            </button>
          ))}
        </div>
      </details>
    </section>
  );
}
