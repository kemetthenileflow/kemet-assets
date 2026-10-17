import React from 'react';
import { DailySymbol } from './ui';
import { KemetIcon, KemetIconName } from './components/KemetIcon';

type Props = { lang: 'en' | 'ar'; go: (route: any) => void; resume: () => void };
export function Home({ lang, go, resume }: Props) {
  const ar = lang === 'ar';
  const skills: [string, string, KemetIconName][] = [
    ['Vocabulary', 'المفردات', 'vocabulary'], ['Reading', 'القراءة', 'reading'],
    ['Grammar', 'القواعد', 'grammar'], ['Listening', 'الاستماع', 'listening'],
    ['Writing', 'الكتابة', 'writing'], ['Story', 'القصة', 'story'],
  ];
  return <div className="learning-home">
    <section className="home-welcome" aria-labelledby="home-title">
      <div className="home-welcome-copy">
        <p className="home-eyebrow">{ar ? 'الوحدة الأولى · تعلّم وتدرّب واكتشف' : 'UNIT 1 · LEARN, PRACTISE, DISCOVER'}</p>
        <h1 id="home-title">{ar ? 'بمعرفتك تصنع أثرًا' : 'Let knowledge shape your legacy.'}</h1>
        <p>{ar ? 'اقرأ لتفهم، وتدرّب لتعبّر، وراجع لترى تقدّمك. ابدأ بخطوة واحدة.' : 'Read to understand. Practise to express yourself. Reflect to see your progress. Begin with one step.'}</p>
        <div className="home-primary-actions">
          <button className="primary" onClick={resume}><KemetIcon name="journey" size={20}/>{ar ? 'واصل التعلم' : 'Continue learning'}<span aria-hidden="true"> →</span></button>
          <button className="home-text-action" onClick={() => go({page:'journey'})}>{ar ? 'اختر خطوتك التعليمية' : 'Choose your learning step'}</button>
        </div>
      </div>
      <aside className="home-source-note" aria-label={ar ? 'المادة الأصلية' : 'Original learning materials'}>
        <KemetIcon name="writing" size={32}/>
        <h2>{ar ? 'ابدأ من المصدر' : 'Begin with the source'}</h2>
        <p>{ar ? 'المنهج الأصلي ونسخ كيمت التعليمية متاحة لك كما هي.' : 'Your original curriculum and KEMET editions, ready to explore.'}</p>
        <button onClick={() => go({page:'pdf_study',id:'unit1_source'})}><KemetIcon name="pdf" size={18}/>{ar ? 'كتاب الوزارة · ١٧٢ صفحة' : 'Ministry textbook · 172 pages'}</button>
        <button onClick={() => go({page:'documents'})}>{ar ? 'كل ملفات PDF الأصلية · ١٨ ملفًا' : 'All 18 original PDFs'}<span aria-hidden="true"> →</span></button>
      </aside>
    </section>

    <section className="home-paths" aria-labelledby="home-paths-title">
      <div className="home-section-heading"><h2 id="home-paths-title">{ar ? 'ماذا تريد أن تتعلّم اليوم؟' : 'What will you explore today?'}</h2><span>{ar ? 'كل المسارات مفتوحة' : 'Every path is open'}</span></div>
      <div className="home-gateways">
        {([
          ['vocabulary','Vocabulary Vault','المفردات','Build meaning, then recall it.','افهم المعنى، ثم استرجعه.','vocabulary'],
          ['story','Story Quest','رحلة القصة','A Dream of Adventure · Chapter 1','حلم المغامرة · الفصل الأول','story'],
          ['challenge','Challenge Arena','ساحة التحدي','Practise, explain and try again.','تدرّب، وفسّر، ثم حاول مجددًا.','challenge'],
        ] as const).map(([page,en,arabic,desc,arDesc,icon]) => <button className="home-gateway" key={page} onClick={() => go({page})}>
          <KemetIcon name={icon} size={30}/><span><strong>{ar ? arabic : en}</strong><small>{ar ? arDesc : desc}</small></span><span aria-hidden="true" className="home-arrow">→</span>
        </button>)}
      </div>
    </section>

    <section className="home-resources" aria-labelledby="home-library-title">
      <div className="home-section-heading"><h2 id="home-library-title">{ar ? 'المكتبة السكندرية' : 'Alexandrian Library'}</h2><span>{ar ? 'اختر المهارة، ثم المادة المناسبة' : 'Choose a skill, then your material'}</span></div>
      <div className="home-skills">{skills.map(([category,arabic,icon]) => <button key={category} onClick={() => go({page:'library',category})}><KemetIcon name={icon} size={22}/><span>{ar ? arabic : category}</span></button>)}</div>
      <div className="home-resource-links">
        <button onClick={() => go({page:'media',tab:'curriculum_listening'})}><KemetIcon name="listening" size={17}/>{ar ? 'استماع الوحدة الأولى' : 'Unit 1 listening'}</button>
        <button onClick={() => go({page:'media'})}><KemetIcon name="video" size={17}/>{ar ? 'مكتبة الصوت والفيديو' : 'Audio & video library'}</button>
        <button onClick={() => go({page:'voice'})}><KemetIcon name="mic" size={17}/>{ar ? 'مرآة الصوت' : 'Spoken Voice Mirror'}</button>
        <button onClick={() => go({page:'pdf_study',id:'unit1_standard'})}><KemetIcon name="pdf" size={17}/>{ar ? 'نسخة كيمت الأساسية للوحدة' : 'KEMET Unit 1 Standard'}</button>
      </div>
    </section>

    <section className="home-heritage" aria-labelledby="home-heritage-title">
      <div className="home-section-heading"><h2 id="home-heritage-title">{ar ? 'استلهم من تراثك' : 'Find inspiration in your heritage'}</h2><KemetIcon name="lotus" size={25}/></div>
      <details className="home-daily"><summary>{ar ? 'رمزك المصري اليوم · اكتشف وتأمّل' : 'Your Egyptian Symbol Today · discover and reflect'}</summary><DailySymbol lang={lang}/></details>
      <div className="home-heritage-links">
        <button onClick={() => go({page:'symbol_discover'})}><KemetIcon name="scarab" size={19}/>{ar ? 'اكتشف الرموز المصرية · ٣١ بطاقة أصلية' : 'Explore Egyptian symbols · 31 original cards'}</button>
        <button onClick={() => go({page:'discover'})}><KemetIcon name="cartouche" size={19}/>{ar ? 'اكتشف حكاية شعار كيمت' : 'Discover the KEMET logo story'}</button>
      </div>
    </section>
  </div>;
}
