import React, { useState } from 'react';
import { EGYPTIAN_ARTIFACTS } from '../data/artifacts';
import { ArtifactItem } from '../types/kemet';
import { KemetButton } from './ui/KemetButton';
import { EyeOfHorusIcon, AnkhIcon, CartoucheIcon, ScarabIcon, FeatherOfMaatIcon } from './ui/EgyptianIcons';
import { playGoldChime, playStoneTap } from '../utils/audio';
import { Landmark, Compass, Calendar, Maximize2, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  isRtl?: boolean;
}

export const ArtifactGallery: React.FC<Props> = ({ isRtl = false }) => {
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactItem>(EGYPTIAN_ARTIFACTS[0]);

  const handleSelectArtifact = (art: ArtifactItem) => {
    setSelectedArtifact(art);
    playStoneTap();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Catalog Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8860B]/15 border border-[#B8860B]/30 text-xs font-semibold text-[#8C6207] dark:text-[#E6C676] uppercase tracking-wider">
          <Landmark className="w-3.5 h-3.5 text-[#B8860B]" />
          <span>{isRtl ? 'خزانة الآثار والقطع الملكية' : 'The Curatorial Museum Archive'}</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#3E2723] dark:text-[#F4EFEA]">
          {isRtl ? 'روائع الحضارة المصرية في سجلات التاريخ' : 'Sacred Pharaonic Relics & Masterpieces'}
        </h2>
        <p className="max-w-2xl mx-auto text-sm text-[#6D4C41] dark:text-stone-300">
          {isRtl
            ? 'سجل متحفي يوثق أهم التحف الأثرية مع أرقام الحيازة الرسمية ونصوص النقوش الهيروغليفية.'
            : 'Explore registered accession records, material composition, and hieroglyphic inscriptions of world-renowned Egyptian treasures.'}
        </p>
      </div>

      {/* Artifact Selector Ribbon */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {EGYPTIAN_ARTIFACTS.map((art) => (
          <button
            key={art.id}
            type="button"
            onClick={() => handleSelectArtifact(art)}
            className={`
              px-4 py-3 rounded-2xl border text-start shrink-0 min-w-[200px] transition-all cursor-pointer
              ${selectedArtifact.id === art.id
                ? 'bg-[#3E2723] text-[#FFD700] border-[#B8860B] shadow-md'
                : 'bg-white/70 dark:bg-stone-900 border-[#D1B894]/70 dark:border-stone-800 text-[#3E2723] dark:text-stone-200 hover:border-[#B8860B]'}
            `}
          >
            <div className="text-[10px] font-mono tracking-wider opacity-75">{art.accessionNumber}</div>
            <div className="font-serif font-bold text-sm truncate mt-0.5">
              {isRtl ? art.arabicTitle : art.title}
            </div>
            <div className="text-[11px] opacity-80 mt-1 truncate">{art.period}</div>
          </button>
        ))}
      </div>

      {/* Selected Artifact Curatorial Monograph */}
      <div className="kemet-royal-card dark:kemet-royal-card-dark p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Representation & Hieroglyphic Seal */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#B8860B]/60 shadow-lg bg-gradient-to-br from-[#EBDDC6] via-[#F4EFEA] to-[#D1B894] dark:from-stone-900 dark:via-stone-950 dark:to-stone-900 min-h-[320px] flex flex-col items-center justify-center p-6 text-center">
            {/* Museum Artifact Vector Badge */}
            <div className="w-24 h-24 rounded-full gold-medallion flex items-center justify-center text-4xl shadow-xl mb-4">
              {selectedArtifact.id === 'tutankhamun-mask' && <EyeOfHorusIcon size={48} tone="dark" />}
              {selectedArtifact.id === 'rosetta-stone' && <CartoucheIcon size={48} tone="dark" />}
              {selectedArtifact.id === 'nefertiti-bust' && <AnkhIcon size={48} tone="dark" />}
              {selectedArtifact.id === 'narmer-palette' && <ScarabIcon size={48} tone="dark" />}
              {selectedArtifact.id === 'ani-papyrus' && <FeatherOfMaatIcon size={48} tone="dark" />}
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#8C6207] dark:text-[#FFD700]">
                {selectedArtifact.accessionNumber}
              </span>
              <h4 className="font-serif font-bold text-xl text-[#3E2723] dark:text-white">
                {isRtl ? selectedArtifact.arabicTitle : selectedArtifact.title}
              </h4>
              <p className="text-xs text-[#6D4C41] dark:text-stone-300 italic">{selectedArtifact.date}</p>
            </div>

            {/* Dominant Material Tag */}
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-stone-900 border border-[#B8860B]/40 text-xs font-semibold text-[#8C6207] dark:text-[#FFD700]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
              <span className="capitalize">{selectedArtifact.dominantMaterial} Craftsmanship</span>
            </div>
          </div>

          {/* Key Glyphs Monogram */}
          <div className="p-4 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-[#D1B894] dark:border-stone-800 space-y-2">
            <span className="text-xs font-serif font-bold text-[#8C6207] dark:text-[#FFD700] uppercase tracking-wider block">
              {isRtl ? 'النقوش المحفورة على الأثر:' : 'Inscribed Epigraphy:'}
            </span>
            <div className="flex items-center gap-3">
              {selectedArtifact.keyHieroglyphs.map((glyph, idx) => (
                <div key={idx} className="px-3 py-2 rounded-xl bg-[#F4EFEA] dark:bg-stone-950 border border-[#B8860B]/40 text-2xl text-[#241604] dark:text-[#FFD700]">
                  {glyph}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Curatorial Accession Details & Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="text-xs font-mono font-bold text-[#8C6207] dark:text-[#FFD700] uppercase tracking-widest">
              Accession Catalog
            </div>
            <h3 className="font-serif font-bold text-2xl lg:text-3xl text-[#3E2723] dark:text-white mt-1">
              {isRtl ? selectedArtifact.arabicTitle : selectedArtifact.title}
            </h3>
            <p className="text-xs text-[#6D4C41] dark:text-stone-400 font-serif italic mt-0.5">
              {selectedArtifact.provenance}
            </p>
          </div>

          {/* Curatorial Prose */}
          <p className="text-sm text-[#5D4037] dark:text-stone-300 leading-relaxed font-sans">
            {isRtl ? selectedArtifact.arabicDescription : selectedArtifact.description}
          </p>

          {/* Accession Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#EBDDC6]/40 dark:bg-stone-900/40 border border-[#D1B894]/60 text-xs">
            <div>
              <span className="font-semibold text-[#8C6207] dark:text-[#FFD700] block">{isRtl ? 'الأسرة والحقبة:' : 'Dynasty & Period:'}</span>
              <span className="text-[#3E2723] dark:text-stone-200">{selectedArtifact.dynasty} · {selectedArtifact.period}</span>
            </div>
            <div>
              <span className="font-semibold text-[#8C6207] dark:text-[#FFD700] block">{isRtl ? 'المادة والتقنية:' : 'Medium & Material:'}</span>
              <span className="text-[#3E2723] dark:text-stone-200">{selectedArtifact.medium}</span>
            </div>
            <div>
              <span className="font-semibold text-[#8C6207] dark:text-[#FFD700] block">{isRtl ? 'الأبعاد والقياسات:' : 'Dimensions:'}</span>
              <span className="text-[#3E2723] dark:text-stone-200">{selectedArtifact.dimensions}</span>
            </div>
            <div>
              <span className="font-semibold text-[#8C6207] dark:text-[#FFD700] block">{isRtl ? 'موقع الاكتشاف:' : 'Discovery Site:'}</span>
              <span className="text-[#3E2723] dark:text-stone-200">{selectedArtifact.provenance}</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <KemetButton
              variant="gold-primary"
              size="md"
              icon={<EyeOfHorusIcon size={18} tone="dark" />}
              onClick={() => playGoldChime(1.1)}
            >
              {isRtl ? 'فحص النقوش المجهرية' : 'Examine Micro-Reliefs'}
            </KemetButton>

            <KemetButton
              variant="turquoise-primary"
              size="md"
              icon={<CartoucheIcon size={18} tone="currentColor" />}
              onClick={() => playGoldChime(1.2)}
            >
              {isRtl ? 'نسخ السجل المتحفي' : 'Cite Accession Record'}
            </KemetButton>
          </div>
        </div>
      </div>
    </div>
  );
};
