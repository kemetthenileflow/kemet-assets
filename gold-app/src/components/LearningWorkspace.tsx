import React, { useState, useRef, useEffect } from 'react';
import core from '../data/curriculum.json';
import { KemetButton } from './ui/KemetButton';
import { AnkhIcon, PapyrusScrollIcon } from './ui/EgyptianIcons';
import { LearningEvent, progressSummary } from '../utils/learningProgress';

type RecordEvent = (event: Omit<LearningEvent,'id'|'at'>) => void;
export function LearningWorkspace({isRtl, record, target, history}: {isRtl:boolean; record:RecordEvent; target?:string; history:LearningEvent[]}) {
  const t=(en:string,ar:string)=>isRtl?ar:en;
  const [scope,setScope]=useState<'unit'|'story'|null>(null);
  const [mode,setMode]=useState('overview');
  const [search,setSearch]=useState('');
  const [pos,setPos]=useState('');
  const [wordId,setWordId]=useState('');
  const [meaning,setMeaning]=useState(false);
  const [arabic,setArabic]=useState(false);
  const [hint,setHint]=useState(false);
  const [spelling,setSpelling]=useState('');
  const [feedback,setFeedback]=useState('');
  const seenAnswers=useRef(new Set(history.filter(e=>e.type==='attempt'&&e.resource.startsWith('question:')).map(e=>e.resource.slice('question:'.length))));
  const [bank,setBank]=useState('V1');
  const [qIndex,setQIndex]=useState(0);
  const [answer,setAnswer]=useState('');
  const [checked,setChecked]=useState(false);
  const [speechStatus,setSpeechStatus]=useState('');
  const selectScope=(next:'unit'|'story')=>{setScope(next);setMode('overview');setWordId('');setSearch('');setPos('');record({type:'open',resource:next});};
  const startWord=(id:string)=>{setWordId(id);setMeaning(false);setArabic(false);setHint(false);setSpelling('');setFeedback('');};
  const words=scope==='story'?core.STORY_VOCABULARY_59.map(v=>({...v,englishMeaning:v.meaning,partOfSpeech:'',arabicMeaning:'',ipa:'',example:v.storyContext})):core.UNIT_1_VOCABULARY;
  const filtered=words.filter(v=>(v.word+' '+v.arabicMeaning).toLocaleLowerCase().includes(search.toLocaleLowerCase())&&(!pos||v.partOfSpeech===pos)).sort((a,b)=>a.word.localeCompare(b.word));
  const word=words.find(v=>v.id===wordId);
  useEffect(()=>{
    if(!target)return;
    setScope(target.startsWith('STORY-')?'story':'unit');
    setMode(target.includes('VOC-')?'vocabulary':target.startsWith('GRAM-')?'grammar':'reading');
    if(target.includes('VOC-'))startWord(target);
  },[target]);
  const questions=core.ALL_330_QUESTIONS.filter(q=>q.bankId===bank);
  const question=questions[qIndex];
  const speak=(text:string,resource:string)=>{
    if(!('speechSynthesis' in window)){setSpeechStatus(t('Browser pronunciation is unavailable.','النطق بالمتصفح غير متاح.'));return;}
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-US';
    utterance.onerror=()=>setSpeechStatus(t('Pronunciation could not play. Retry or check your device sound.','تعذر تشغيل النطق. أعد المحاولة أو افحص صوت الجهاز.'));
    utterance.onstart=()=>record({type:'audio',resource});
    window.speechSynthesis.speak(utterance);setSpeechStatus(t('Browser US English pronunciation requested.','تم طلب نطق أمريكي من المتصفح.'));
  };
  return <section aria-label={t('Curriculum','المنهج')} className="space-y-6">
    <h2 className="text-3xl font-serif font-bold">{t('Curriculum','المنهج')}</h2>
    <p>{t('Meaning → Understanding → Construction → Practice → Application → Mastery','المعنى ← الفهم ← البناء ← الممارسة ← التطبيق ← الإتقان')}</p>
    <div className="grid sm:grid-cols-2 gap-5">
      {(['unit','story'] as const).map(s=><article key={s} className="kemet-royal-card p-6 space-y-3">
        <h3 className="text-xl font-serif font-bold">{s==='unit'?t('Unit 1','الوحدة الأولى'):t('Story — Chapter 1','القصة — الفصل الأول')}</h3>
        <p lang="en" dir="ltr">{s==='unit'?'Living Well in a Complex World':'The Lost World — A Dream of Adventure'}</p>
        <KemetButton variant={s==='unit'?'gold-primary':'turquoise-primary'} onClick={()=>selectScope(s)}>{s==='unit'?t('Open Unit','افتح الوحدة'):t('Open Story','افتح القصة')}</KemetButton>
      </article>)}
    </div>
    {scope&&<div className="space-y-5">
      <nav aria-label={t('Learning activities','أنشطة التعلم')} className="flex flex-wrap gap-3">
        {['overview','vocabulary','reading',...(scope==='unit'?['grammar','questions']:[])].map(m=><KemetButton key={m} variant={mode===m?'gold-primary':'gold-secondary'} onClick={()=>{setMode(m);record({type:'open',resource:scope+':'+m});}}>{({overview:t('Overview','نظرة عامة'),vocabulary:t('Vocabulary','المفردات'),reading:t('Reading','القراءة'),grammar:t('Grammar','القواعد'),questions:t('Questions','الأسئلة')} as Record<string,string>)[m]}</KemetButton>)}
      </nav>
      {mode==='overview'&&<article className="kemet-royal-card p-6 space-y-4"><h3 className="text-2xl font-serif">{t('Your learning path','مسارك التعليمي')}</h3><p>{t('Observe a context, ask what the evidence tells you, explain your understanding, practise, then apply it independently. Choose any activity and return for revision.','لاحظ السياق، وتساءل عما يدل عليه، واشرح فهمك، وتدرّب، ثم طبّق بصورة مستقلة. اختر أي نشاط وعد للمراجعة.')}</p><p>{t('Original PDFs, listening files, videos and games are awaiting verified import into this draft. Available text activities below use the recovered curriculum source.','ملفات PDF الأصلية والاستماع والفيديو والألعاب في انتظار الاستيراد المتحقق منه إلى هذه المسودة. الأنشطة النصية المتاحة تستخدم مصدر المنهج المسترجع.')}</p><KemetButton onClick={()=>setMode('vocabulary')}>{t('Discover Vocabulary','اكتشف المفردات')}</KemetButton></article>}
      {mode==='vocabulary'&&<div className="space-y-5">
        <p>{filtered.length} / {words.length} {t('words available','كلمة متاحة')}</p>
        <label className="block">{t('Search English or Arabic','ابحث بالإنجليزية أو العربية')}<input className="block rounded border p-3 bg-white text-[#3E2723] w-full" value={search} onChange={e=>setSearch(e.target.value)}/></label>
        {scope==='unit'&&<label>{t('Part of speech','نوع الكلمة')}<select className="block border rounded p-3 bg-white text-[#3E2723]" value={pos} onChange={e=>setPos(e.target.value)}><option value="">{t('All','الكل')}</option>{Array.from(new Set(words.map(v=>v.partOfSpeech))).sort().map(p=><option key={p}>{p}</option>)}</select></label>}
        <label className="block">{t('Choose a word','اختر كلمة')}<select className="block border rounded p-3 bg-white text-[#3E2723] w-full" value={filtered.some(v=>v.id===wordId)?wordId:''} onChange={e=>startWord(e.target.value)}><option value="">{t('Select a word','اختر كلمة')}</option>{filtered.map(v=><option key={v.id} value={v.id}>{v.word}</option>)}</select></label>
        {!filtered.length&&<p role="status">{t('No matching words. Try another search or filter.','لا توجد كلمات مطابقة. جرّب بحثًا أو تصنيفًا آخر.')}</p>}
        {word&&<article key={word.id} className="kemet-royal-card p-6 space-y-4">
          <h3 lang="en" dir="ltr" className="font-serif text-3xl">{word.word}</h3>
          <p lang="en" dir="ltr">{word.partOfSpeech} {word.ipa}</p>
          <p>{t('Read the context. Which words help you infer the meaning? Explain your prediction before revealing the definition.','اقرأ السياق. ما الكلمات التي تساعدك على استنتاج المعنى؟ فسّر توقعك قبل كشف التعريف.')}</p>
          <blockquote className="border-s-4 border-[#B8860B] ps-4" lang="en" dir="ltr">{word.example}</blockquote>
          <div className="flex flex-wrap gap-3">
            <KemetButton variant="gold-secondary" onClick={()=>{setHint(true);record({type:'hint',resource:word.id});}}>{t('Show Hint','اعرض تلميحًا')}</KemetButton>
            <KemetButton variant="gold-secondary" onClick={()=>{setMeaning(!meaning);}}>{meaning?t('Hide Meaning','أخفِ المعنى'):t('Reveal Meaning','اكشف المعنى')}</KemetButton>
            {word.arabicMeaning&&<KemetButton variant="gold-secondary" icon={<AnkhIcon size={16}/>} onClick={()=>{setArabic(!arabic);if(!arabic)record({type:'translation',resource:word.id});}}>{t('Arabic Meaning','المعنى بالعربية')}</KemetButton>}
            <KemetButton variant="turquoise-primary" onClick={()=>speak(word.word,word.id)}>{t('Listen — Browser Voice','استمع — صوت المتصفح')}</KemetButton>
          </div>
          {hint&&<p>{t('Consider whether the context describes an action, a quality or an idea. Compare your prediction with the example.','فكّر: هل يصف السياق فعلًا أم صفة أم فكرة؟ قارن توقعك بالمثال.')}</p>}
          {meaning&&<p lang="en" dir="ltr">{word.englishMeaning}</p>}
          {arabic&&<p lang="ar" dir="rtl">{word.arabicMeaning}</p>}
          <p>{t('Copy, hide and spell the word. This guided spelling practice is not an independent mastery test.','انسخ الكلمة ثم أخفها وحاول تهجئتها. هذا تدريب موجّه وليس اختبار إتقان مستقلًا.')}</p>
          <label className="block">{t('Type the word','اكتب الكلمة')}<input lang="en" dir="ltr" className="block rounded border bg-white text-[#3E2723] p-3 w-full" value={spelling} onChange={e=>setSpelling(e.target.value)}/></label>
          <KemetButton disabled={!spelling.trim()||!!feedback} onClick={()=>{const correct=spelling.trim().toLocaleLowerCase()===word.word.toLocaleLowerCase();setFeedback(correct?t('Correct spelling. Now use it in a sentence.','تهجئة صحيحة. استخدمها الآن في جملة.'):t('Check the spelling and retry.','راجع التهجئة وحاول مجددًا.'));record({type:'attempt',resource:word.id,result:correct?'correct':'incorrect',assisted:true});}}>{t('Check Spelling','تحقق من التهجئة')}</KemetButton>
          <KemetButton variant="tertiary" onClick={()=>{setFeedback('');setSpelling('');}}>{t('Retry','حاول مجددًا')}</KemetButton>
          <p role="status">{feedback}</p><p role="status">{speechStatus}</p>
          <small>{t('Source','المصدر')}: {word.id}</small>
        </article>}
      </div>}
      {mode==='reading'&&core.READING_PASSAGES.filter(p=>scope==='story'?p.id==='STORY-CH1':p.id!=='STORY-CH1').map(p=><article key={p.id} className="kemet-royal-card p-6 space-y-4"><h3 lang="en" dir="ltr" className="text-xl font-serif">{p.title}</h3>{p.paragraphs.map((text,i)=><p key={i} lang="en" dir="ltr">{text}</p>)}<p>{t('What evidence supports your interpretation? Explain it in your own words.','ما الدليل الذي يؤيد تفسيرك؟ اشرحه بأسلوبك.')}</p><KemetButton variant="gold-secondary" onClick={()=>record({type:'review',resource:'reading:'+p.id})}>{t('Mark as Reviewed','حدّد كمُراجع')}</KemetButton><small className="block">{t('Source','المصدر')}: {p.id}</small></article>)}
      {mode==='grammar'&&core.GRAMMAR_REFERENCES.map(g=><details key={g.id} className="kemet-royal-card p-5"><summary className="min-h-11 cursor-pointer font-serif font-bold" lang="en" dir="ltr">{g.title}</summary><div className="space-y-3">{g.englishRules.map((r,i)=><p key={i} lang="en" dir="ltr">{r}</p>)}<details onToggle={e=>{if(e.currentTarget.open)record({type:'translation',resource:g.id});}}><summary>{t('Arabic Explanation','الشرح بالعربية')}</summary>{g.arabicRules.map((r,i)=><p key={i} lang="ar" dir="rtl">{r}</p>)}</details>{g.examples.map((e,i)=><blockquote key={i} lang="en" dir="ltr">{e.en} — {e.note}</blockquote>)}<small>{g.id}</small></div></details>)}
      {mode==='questions'&&<article className="kemet-royal-card p-6 space-y-4">
        <label>{t('Question bank','بنك الأسئلة')}<select className="block p-3 rounded border bg-white text-[#3E2723] max-w-full" value={bank} onChange={e=>{setBank(e.target.value);setQIndex(0);setAnswer('');setChecked(false);}}>{core.BANK_METADATA.map(b=><option key={b.id} value={b.id}>{b.name} ({b.count})</option>)}</select></label>
        {question&&<><p>{qIndex+1} / {questions.length} · {question.id} · {question.level}</p><h3 className="text-xl" lang="en" dir="ltr">{question.prompt}</h3>
          {'options' in question&&Array.isArray(question.options)?<fieldset disabled={checked}><legend>{t('Choose your answer','اختر إجابتك')}</legend>{question.options.map(o=><label key={o.id} className="block min-h-11 p-3 border rounded my-2"><input type="radio" name={question.id} value={o.id} checked={answer===o.id} onChange={e=>setAnswer(e.target.value)}/> <span lang="en" dir="ltr">{o.text}</span></label>)}</fieldset>:<label>{t('Your answer — teacher review required','إجابتك — تحتاج مراجعة معلم')}<textarea className="block p-3 border rounded bg-white text-[#3E2723] w-full" disabled={checked} value={answer} onChange={e=>setAnswer(e.target.value)}/></label>}
          <KemetButton disabled={!answer.trim()||checked} onClick={()=>{setChecked(true);const auto=question.grading==='deterministic_choice'&&'correctOptionId' in question;record({type:'attempt',resource:'question:'+question.id,result:auto?(answer===question.correctOptionId?'correct':'incorrect'):'pending',assisted:seenAnswers.current.has(question.id)});seenAnswers.current.add(question.id);}}>{t('Submit Answer','أرسل الإجابة')}</KemetButton>
          {checked&&<div role="status" className="space-y-2"><p>{question.grading==='deterministic_choice'&&'correctOptionId' in question?(answer===question.correctOptionId?t('Correct.','صحيح.'):t('Review the answer and explanation.','راجع الإجابة والتفسير.')):t('Saved for review; no automatic score awarded.','حُفظت للمراجعة؛ لم تُمنح درجة آلية.')}</p><p lang="en" dir="ltr">{question.sourceAnswer}</p><p lang="en" dir="ltr">{question.explanation}</p></div>}
          <div className="flex flex-wrap gap-3">{[-1,1].map(step=><KemetButton key={step} variant="tertiary" disabled={qIndex+step<0||qIndex+step>=questions.length} onClick={()=>{setQIndex(qIndex+step);setAnswer('');setChecked(false);}}>{step<0?t('Previous','السابق'):t('Next','التالي')}</KemetButton>)}</div>
        </>}
      </article>}
    </div>}
  </section>;
}

export function ProgressPanel({isRtl,events}: {isRtl:boolean;events:LearningEvent[]}) {
  const t=(en:string,ar:string)=>isRtl?ar:en;const totals=progressSummary(events);
  return <section className="space-y-6"><h2 className="text-3xl font-serif font-bold">{t('My Progress','تقدمي')}</h2><p>{t('Guest progress is saved on this device only. Account sign-in and secure cloud synchronization are not connected.','يُحفظ تقدم الضيف على هذا الجهاز فقط. تسجيل الحساب والمزامنة السحابية الآمنة غير موصولين.')}</p>{!events.length?<p>{t('No activity recorded yet. Start with Curriculum.','لم يُسجّل نشاط بعد. ابدأ بالمنهج.')}</p>:<><dl className="grid sm:grid-cols-3 gap-4">{[[t('Attempts','المحاولات'),totals.attempts],[t('Correct','صحيح'),totals.correct],[t('Incorrect','غير صحيح'),totals.incorrect],[t('Awaiting Review','بانتظار المراجعة'),totals.pending],[t('Hints','التلميحات'),totals.hints],[t('Translation Reveals','كشف الترجمة'),totals.translations],[t('Audio Started','بدء الصوت'),totals.audioRequests],[t('Texts Reviewed','نصوص روجعت'),totals.reviewed]].map(([label,count])=><div key={label} className="kemet-royal-card p-5"><dt>{label}</dt><dd className="text-3xl font-serif">{count}</dd></div>)}</dl><p>{t('Opening a page does not count as completion. Mastery and retention need repeated independent evidence; no mastery claim is made yet.','فتح الصفحة لا يُعد إكمالًا. يحتاج الإتقان والاحتفاظ إلى أدلة متكررة مستقلة؛ لم يُثبت الإتقان بعد.')}</p><h3 className="text-xl font-serif">{t('Recent Activity','النشاط الأخير')}</h3><ol className="space-y-2">{events.slice(-15).reverse().map(e=><li key={e.id} className="border-b border-[#D1B894] py-2"><time dateTime={e.at}>{new Date(e.at).toLocaleString(isRtl?'ar-EG':'en-GB')}</time> · <span lang="en" dir="ltr">{e.resource}</span> · {({open:t('Opened','فتح'),hint:t('Hint','تلميح'),translation:t('Translation','ترجمة'),audio:t('Audio','صوت'),attempt:t('Attempt','محاولة'),review:t('Reviewed','مراجعة')})[e.type]}</li>)}</ol></>}</section>;
}

export function ThothSearch({isRtl,onOpen}: {isRtl:boolean;onOpen:(sourceId:string)=>void}) {
  const [query,setQuery]=useState('');const t=(en:string,ar:string)=>isRtl?ar:en;
  const terms=query.trim().toLocaleLowerCase();
  const records=[...core.UNIT_1_VOCABULARY.map(v=>({id:v.id,title:v.word,text:v.englishMeaning+' '+v.arabicMeaning})),...core.STORY_VOCABULARY_59.map(v=>({id:v.id,title:v.word,text:v.meaning})),...core.GRAMMAR_REFERENCES.map(g=>({id:g.id,title:g.title,text:g.englishRules.join(' ')})),...core.READING_PASSAGES.map(p=>({id:p.id,title:p.title,text:p.paragraphs.join(' ')}))];
  const results=terms?records.filter(r=>(r.title+' '+r.text).toLocaleLowerCase().includes(terms)).slice(0,20):[];
  return <details className="kemet-royal-card p-6"><summary className="font-serif text-xl cursor-pointer min-h-11">{t('Ask Thoth — Curriculum Search','اسأل تحوت — بحث المنهج')}</summary><label className="block py-4">{t('Search the approved learning text','ابحث في النص التعليمي المعتمد')}<input value={query} onChange={e=>setQuery(e.target.value)} className="block w-full rounded border p-3 bg-white text-[#3E2723]"/></label><p>{t('Local source search. Results quote the supplied learning data; no AI-generated answers or paid API calls.','بحث محلي في المصادر. تعرض النتائج البيانات التعليمية الموردة؛ دون إجابات مولدة أو طلبات API مدفوعة.')}</p>{terms&&!results.length&&<p role="status">{t('No matching source found. Try another term.','لم يُعثر على مصدر مطابق. جرّب مصطلحًا آخر.')}</p>}<ul className="space-y-4 mt-4">{results.map(r=><li key={r.id}><strong lang="en" dir="ltr">{r.title}</strong><p>{r.text}</p><small>{r.id}</small><KemetButton variant="tertiary" onClick={()=>onOpen(r.id)}>{t('Open Curriculum','افتح المنهج')}</KemetButton></li>)}</ul></details>;
}
