import React from 'react';
import { AnkhIcon } from './ui/EgyptianIcons';
export const Footer: React.FC<{isRtl?: boolean; onNavigate?: (tab: string) => void}> = ({isRtl = false, onNavigate}) => (
  <footer className="w-full bg-[#EBDDC6]/70 dark:bg-[#141210] border-t border-[#D1B894] dark:border-stone-800 py-10 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <span className="inline-flex items-center gap-3 font-serif font-bold"><AnkhIcon size={24} tone="gold"/>KEMET: The Nile Flow</span>
        <div className="flex flex-wrap gap-4">
          {(['curriculum','media','progress'] as const).map((id,i) => <button key={id} type="button" className="min-h-11 underline decoration-[#B8860B] underline-offset-4" onClick={() => onNavigate?.(id)}>{(isRtl ? ['المنهج','مكتبة الوسائط','تقدمي'] : ['Curriculum','Media Library','My Progress'])[i]}</button>)}
        </div>
      </div>
      <p className="text-sm leading-relaxed">{isRtl ? 'الفكرة والمحتوى التعليمي والتصميم التعليمي والهوية البصرية والتوجيه الإبداعي: د. مي أبو الفتوح. المراجعة والتدقيق: ريهام صلاح خفاجي. المواد المصدرية التكميلية: أسامة عزام.' : 'Creative concept, educational content development, instructional design, visual identity and creative direction: Dr. Mai Abulfotouh. Review and proofreading: Riham Salah Khafagy. Supplementary source material: Osama Azzam.'}</p>
    </div>
  </footer>
);
