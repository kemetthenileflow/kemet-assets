import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DesignSystemStyleGuide } from './components/DesignSystemStyleGuide';
import { HieroglyphDecipherer } from './components/HieroglyphDecipherer';
import { RoyalCartoucheCreator } from './components/RoyalCartoucheCreator';
import { ScribeAcademy } from './components/ScribeAcademy';
import { ArtifactGallery } from './components/ArtifactGallery';
import { KemetButton } from './components/ui/KemetButton';
import { ScarabIcon, EyeOfHorusIcon, PapyrusScrollIcon } from './components/ui/EgyptianIcons';
import { LearningWorkspace, ProgressPanel, ThothSearch } from './components/LearningWorkspace';
import { LearningEvent, parseProgress, PROGRESS_KEY } from './utils/learningProgress';

type Destination = 'home'|'curriculum'|'media'|'progress';
export default function App() {
  const [activeTab,setActiveTab]=useState<Destination>('home');
  const [isRtl,setIsRtl]=useState(false);
  const [isDark,setIsDark]=useState(false);
  const [sourceTarget,setSourceTarget]=useState('');
  const [culturalTab,setCulturalTab]=useState('');
  const [cartoucheTransferName,setCartoucheTransferName]=useState('RAMSES');
  const storageReadable=useRef(true);
  const [events,setEvents]=useState<LearningEvent[]>(()=>{
    try{return parseProgress(window.localStorage.getItem(PROGRESS_KEY));}
    catch{storageReadable.current=false;return [];}
  });
  const [storageProblem,setStorageProblem]=useState(!storageReadable.current);
  const t=(en:string,ar:string)=>isRtl?ar:en;
  const record=useCallback((event:Omit<LearningEvent,'id'|'at'>)=>setEvents(prev=>[...prev,{...event,id:crypto.randomUUID(),at:new Date().toISOString()}]),[]);
  const navigate=(next:string)=>{
    if(!['home','curriculum','media','progress'].includes(next))return;
    setActiveTab(next as Destination);
    record({type:'open',resource:next});
  };
  useEffect(()=>{
    document.documentElement.dir=isRtl?'rtl':'ltr';
    document.documentElement.lang=isRtl?'ar':'en';
  },[isRtl]);
  useEffect(()=>{
    if(!storageReadable.current)return;
    try{window.localStorage.setItem(PROGRESS_KEY,JSON.stringify({version:1,events}));setStorageProblem(false);}
    catch{setStorageProblem(true);}
  },[events]);
  return <div className={`min-h-screen flex flex-col ${isDark?'dark papyrus-dark-texture text-stone-100':'papyrus-texture text-[#3E2723]'}`}>
    <a className="sr-only focus:not-sr-only focus:p-4" href="#learning-content">{t('Skip to learning content','انتقل إلى المحتوى التعليمي')}</a>
    <Header activeTab={activeTab} setActiveTab={navigate} isRtl={isRtl} setIsRtl={setIsRtl} isDark={isDark} setIsDark={setIsDark}/>
    {activeTab==='home'&&<section className="relative overflow-hidden border-b border-[#D1B894] dark:border-stone-800 bg-gradient-to-b from-[#EBDDC6]/80 via-[#F4EFEA]/40 to-transparent dark:from-stone-900/60 dark:to-transparent py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-start">
            <p className="font-serif font-bold text-[#684605] dark:text-[#FFD700]">{t('KEMET AI Language Assistant','مساعد كيمت الذكي لتعلم اللغة')}</p>
            <h1 lang="en" dir="ltr" className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-[#3E2723] dark:text-[#FFD700] leading-tight">KEMET: The Nile Flow</h1>
            <p className="text-2xl tracking-[.2em] text-[#684605] dark:text-[#FFD700]" aria-label={t('Kemet in Egyptian hieroglyphs','كِمِت بالهيروغليفية')} lang="egy" dir="ltr">𓆎 𓅓 𓏏 𓊖</p>
            <p className="font-bold">{t('For Egyptian Secondary and Baccalaureate Students','لطلاب المرحلة الثانوية والبكالوريا المصرية')}</p>
            <p className="leading-relaxed">{t('Learn English through meaning, questions and discovery. Explore your curriculum, build understanding, practise with feedback and apply your knowledge with confidence.','تعلّم الإنجليزية عبر المعنى والتساؤل والاكتشاف. استكشف منهجك وابنِ فهمك وتدرّب مع التغذية الراجعة وطبّق معرفتك بثقة.')}</p>
            <KemetButton variant="gold-primary" size="lg" icon={<ScarabIcon size={20} tone="dark"/>} onClick={()=>navigate('curriculum')}>{t('Start Learning','ابدأ التعلم')}</KemetButton>
          </div>
          <aside className="w-full max-w-sm kemet-royal-card p-6 space-y-4">
            <EyeOfHorusIcon size={40} tone="gold"/>
            <h2 className="font-serif font-bold text-xl">{t('Your Egyptian Symbol Today','رمزك المصري اليوم')}</h2>
            <p>{t('The original symbol-card collection is being restored. Your original artwork will appear here after its source mapping is verified.','يجري استرجاع مجموعة بطاقات الرموز الأصلية. سيظهر التصميم الأصلي هنا بعد التحقق من ربطه بمصدره.')}</p>
          </aside>
        </div>
      </div>
    </section>}
    <main id="learning-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      {storageProblem&&<p role="alert" className="p-4 border-2 border-[#B8860B] rounded">{t('Device storage is unavailable or an older record could not be read. This session still works, but new progress may not survive reload. Existing unreadable records are preserved.','تخزين الجهاز غير متاح أو تعذرت قراءة سجل سابق. الجلسة تعمل لكن قد لا يُحفظ التقدم بعد إعادة التحميل. لم تُحذف السجلات غير المقروءة.')}</p>}
      {activeTab==='home'&&<>
        <div className="grid md:grid-cols-3 gap-5">{(['curriculum','media','progress'] as const).map((id,i)=><article key={id} className="kemet-royal-card p-6 space-y-4"><PapyrusScrollIcon size={24} tone="gold"/><h2 className="font-serif font-bold text-2xl">{(isRtl?['المنهج','مكتبة الوسائط','تقدمي']:['Curriculum','Media Library','My Progress'])[i]}</h2><p>{(isRtl?['الوحدة والقصة في بيئتي تعلم منفصلتين.','المواد الثقافية والوسائط التعليمية.','نتائج محاولاتك الفعلية على هذا الجهاز.']:['Separate Unit and Story learning environments.','English media and Egyptian cultural experiences.','Your actual attempts and reviews on this device.'])[i]}</p><KemetButton variant={i===1?'turquoise-primary':'gold-secondary'} onClick={()=>navigate(id)}>{t('Explore','استكشف')}</KemetButton></article>)}</div>
        <p>{t('Meaning → Understanding → Construction → Practice → Application → Mastery','المعنى ← الفهم ← البناء ← الممارسة ← التطبيق ← الإتقان')}</p>
      </>}
      <div hidden={activeTab!=='curriculum'}><LearningWorkspace isRtl={isRtl} record={record} target={sourceTarget} history={events}/></div>
      {activeTab==='progress'&&<ProgressPanel isRtl={isRtl} events={events}/>}
      {activeTab==='media'&&<section className="space-y-5"><h2 className="text-3xl font-serif font-bold">{t('Media Library','مكتبة الوسائط')}</h2><p>{t('Original English songs, curriculum recordings, story narration and videos are awaiting verified file import. The existing Egyptian cultural experiences remain available below.','الأغاني الإنجليزية الأصلية وتسجيلات المنهج وسرد القصة والفيديو في انتظار استيراد الملفات والتحقق منها. التجارب الثقافية المصرية الحالية متاحة أدناه.')}</p><h3 className="text-xl font-serif">{t('Egyptian Heritage','التراث المصري')}</h3><div className="flex flex-wrap gap-3">{['decipherer','cartouche','academy','artifacts'].map((id,i)=><KemetButton key={id} variant={id===culturalTab?'gold-primary':'turquoise-primary'} onClick={()=>{setCulturalTab(id);record({type:'open',resource:'culture:'+id});}}>{(isRtl?['فك الهيروغليفية','الخرطوش الملكي','أكاديمية الكتبة','الآثار الملكية']:['Hieroglyph Decipherer','Cartouche Forge','Scribe Academy','Royal Relics'])[i]}</KemetButton>)}</div>
        <p>{t('Cultural activities are enrichment; their scores are separate from the English curriculum.','الأنشطة الثقافية إثراء؛ ودرجاتها منفصلة عن منهج الإنجليزية.')}</p>
        {culturalTab==='decipherer'&&<HieroglyphDecipherer isRtl={isRtl} onSendToCartouche={name=>{setCartoucheTransferName(name.toUpperCase());setCulturalTab('cartouche');}}/>}
        {culturalTab==='cartouche'&&<RoyalCartoucheCreator isRtl={isRtl} initialName={cartoucheTransferName}/>}
        {culturalTab==='academy'&&<ScribeAcademy isRtl={isRtl}/>}
        {culturalTab==='artifacts'&&<ArtifactGallery isRtl={isRtl}/>}
        <details className="kemet-royal-card p-5"><summary className="cursor-pointer min-h-11 font-serif">{t('Design Reference','مرجع التصميم')}</summary><DesignSystemStyleGuide isRtl={isRtl}/></details>
      </section>}
      <ThothSearch isRtl={isRtl} onOpen={id=>{setSourceTarget(id);navigate('curriculum');}}/>
    </main>
    <Footer isRtl={isRtl} onNavigate={navigate}/>
  </div>;
}
