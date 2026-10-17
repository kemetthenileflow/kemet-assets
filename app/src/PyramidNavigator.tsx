import React,{useState} from 'react';
const stages=[
 {en:'Start & orient',ar:'ابدأ واكتشف',paths:[['Original Ministry textbook · 172 pages','كتاب الوزارة الأصلي',{page:'pdf_study',id:'unit1_source'}],['All 18 original PDFs','كل ملفات PDF',{page:'documents'}],['Unit overview','نظرة على الوحدة',{page:'journey'}]]},
 {en:'Explore & understand',ar:'استكشف وافهم',paths:[['Vocabulary Vault','المفردات',{page:'vocabulary'}],['Story Quest','القصة',{page:'story'}],['Alexandrian Reading','القراءة',{page:'library',category:'Reading'}],['Curriculum Listening','الاستماع المنهجي',{page:'media',tab:'curriculum_listening'}]]},
 {en:'Build & practise',ar:'ابنِ وتدرّب',paths:[['Grammar Sentence Builder','بناء الجمل',{page:'grammar_pyramid',mode:'builder'}],['Error Detective','محقق الأخطاء',{page:'grammar_pyramid',mode:'detective'}],['Grammar lessons','دروس القواعد',{page:'library',category:'Grammar'}]]},
 {en:'Apply & express',ar:'طبّق وعبّر',paths:[['Voice Mirror','مرآة الصوت',{page:'voice'}],['Writer’s Papyrus','بردية الكاتب',{page:'writing'}],['Seshat Evidence Hunt','البحث عن الدليل',{page:'evidence_hunt'}]]},
 {en:'Challenge & reflect',ar:'تحدَّ وتأمّل',paths:[['Challenge Arena','ساحة التحدي',{page:'challenge'}],['Rosetta Decoder','فك شفرة رشيد',{page:'rosetta_decoder'}],['Nile Quest','رحلة النيل',{page:'nile_quest'}],['Osiris Challenges','تحديات أوزيريس',{page:'osiris'}],['Progress','التقدم',{page:'results'}]]}
];
export function SteppedPyramid({go,lang='en',onSelectSupport,support='independent'}:{go:(r:any)=>void;lang?:'en'|'ar';onSelectSupport?:(s:string)=>void;support?:string}){
 const [selected,setSelected]=useState(0),ar=lang==='ar';const stage=stages[selected];
 return <section className="temple-path" aria-label="KEMET Learning Pyramid" dir={ar?'rtl':'ltr'}>
 <h2>{ar?'اختر خطوتك':'Choose your learning step'}</h2><p>{ar?'مسار مقترح، وكل الأقسام متاحة من البداية.':'A suggested journey. Every section is open from the beginning.'}</p>
 <div className="temple-path-grid"><div className="stone-steps">{stages.map((s,i)=><button key={s.en} style={{width:`${100-i*11}%`}} aria-pressed={selected===i} aria-controls="pyramid-paths" onClick={()=>setSelected(i)}><span>{i+1}</span> {ar?s.ar:s.en}</button>)}</div>
 <div id="pyramid-paths" className="stone-paths"><h3>{ar?stage.ar:stage.en}</h3><div>{stage.paths.map(([en,arabic,route])=><button key={String(en)} onClick={()=>go(route)}>{String(ar?arabic:en)} →</button>)}</div><label>{ar?'الدعم الاختياري':'Optional support'}<select value={support} onChange={e=>onSelectSupport?.(e.target.value)}><option value="supported">{ar?'مع مساعدة':'Supported'}</option><option value="independent">{ar?'مستقل':'Independent'}</option><option value="stretch">{ar?'توسّع':'Stretch'}</option></select></label></div></div>
 <details><summary>{ar?'كل المسارات مباشرة':'All learning paths'}</summary><div className="all-paths">{stages.flatMap(s=>s.paths).map(([en,arabic,route])=><button key={String(en)} onClick={()=>go(route)}>{String(ar?arabic:en)}</button>)}</div></details>
 </section>;
}
