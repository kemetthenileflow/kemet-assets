import React, { useState } from 'react';
import { UNILITERAL_GLYPHS, SACRED_ROYAL_SYMBOLS, transliterateToHieroglyphs } from '../data/hieroglyphs';
import { HieroglyphSign } from '../types/kemet';
import { KemetButton } from './ui/KemetButton';
import { ScarabIcon, AnkhIcon, CartoucheIcon, PapyrusScrollIcon, EyeOfHorusIcon } from './ui/EgyptianIcons';
import { playGoldChime, playStoneTap } from '../utils/audio';
import { Copy, Check, Volume2, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  isRtl?: boolean;
  onSendToCartouche?: (text: string, glyphs: string) => void;
}

export const HieroglyphDecipherer: React.FC<Props> = ({ isRtl = false, onSendToCartouche }) => {
  const [inputText, setInputText] = useState('RAMSES');
  const [selectedGlyph, setSelectedGlyph] = useState<HieroglyphSign>(UNILITERAL_GLYPHS[0]);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'uniliteral' | 'symbols'>('uniliteral');

  const { glyphs: transliteratedResult, letters } = transliterateToHieroglyphs(inputText);

  const handleCopy = () => {
    navigator.clipboard.writeText(transliteratedResult);
    playGoldChime(1.2);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectGlyph = (g: HieroglyphSign) => {
    setSelectedGlyph(g);
    playStoneTap();
  };

  const handleInsertGlyphToInput = (g: HieroglyphSign) => {
    setInputText((prev) => prev + (g.id.length === 1 ? g.id.toUpperCase() : ''));
    playGoldChime(1.1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Title & Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8860B]/15 border border-[#B8860B]/30 text-xs font-semibold text-[#8C6207] dark:text-[#E6C676] uppercase tracking-wider">
          <PapyrusScrollIcon size={14} tone="gold" />
          <span>{isRtl ? 'محبرة الكاتب الملكي' : 'Royal Scribe Translation Desk'}</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#3E2723] dark:text-[#F4EFEA]">
          {isRtl ? 'مترجم الخط الهيروغليفي وفك الشفرات' : 'Hieroglyph Decipherer & Phonetic Engine'}
        </h2>
        <p className="max-w-2xl mx-auto text-sm text-[#6D4C41] dark:text-stone-300">
          {isRtl
            ? 'حوّل أسماءك والكلمات إلى الكتابة الهيروغليفية الأصلية المعتمدة وفق قائمة عالم المصريات آلان جاردنر.'
            : 'Transliterate modern names and vocabulary into classical Egyptian hieroglyphs based on Sir Alan Gardiner\'s sign list.'}
        </p>
      </div>

      {/* Main Interactive Translation Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main Workspace: Input & Inscription Canvas */}
        <div className="lg:col-span-7 space-y-6">
          <div className="kemet-royal-card dark:kemet-royal-card-dark p-6 space-y-5">
            {/* Input field */}
            <div className="space-y-2">
              <label htmlFor="hieroglyph-input" className="block text-xs font-bold uppercase tracking-wider text-[#8C6207] dark:text-[#FFD700]">
                {isRtl ? 'أدخل اسمك أو كلمة بالإنجليزية للتشفير الملكي:' : 'Enter Name or Word to Decipher:'}
              </label>
              <div className="relative">
                <input
                  id="hieroglyph-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value.toUpperCase())}
                  placeholder={isRtl ? 'مثال: RAMSES أو CLEOPATRA' : 'e.g. TUTANKHAMUN or CLEOPATRA'}
                  className="w-full h-12 px-4 rounded-xl font-serif text-lg font-bold tracking-widest uppercase bg-white/80 dark:bg-stone-900 border-2 border-[#D1B894] dark:border-stone-700 text-[#3E2723] dark:text-[#FFD700] focus:border-[#B8860B] focus:ring-2 focus:ring-[#FFD700]/30 outline-none transition-all placeholder:text-stone-400"
                  maxLength={25}
                />
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  {isRtl ? 'مسح' : 'Clear'}
                </button>
              </div>
            </div>

            {/* Inscription Display Canvas (Papyrus Textured) */}
            <div className="p-6 rounded-2xl bg-[#FBF7EE] dark:bg-stone-950 border-2 border-[#B8860B]/50 shadow-inner space-y-4">
              <div className="flex items-center justify-between border-b border-[#D1B894]/40 pb-2 text-xs text-[#6D4C41] dark:text-stone-400">
                <span className="font-serif font-bold uppercase tracking-wider text-[#8C6207] dark:text-[#FFD700]">
                  {isRtl ? 'النقش الهيروغليفي الملكي' : 'Sacred Inscription Output'}
                </span>
                <span className="font-mono text-[11px]">{letters.length} {isRtl ? 'علامات' : 'Signs'}</span>
              </div>

              {/* Hieroglyphic characters visual strip */}
              <div className="min-h-[90px] flex flex-wrap items-center justify-center gap-3 py-3">
                {letters.length > 0 ? (
                  letters.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/80 dark:bg-stone-900 border border-[#D1B894] dark:border-stone-800 shadow-sm hover:border-[#B8860B] hover:scale-105 transition-all cursor-pointer"
                      onClick={() => playGoldChime(1.0 + idx * 0.05)}
                      title={`${item.char} → Gardiner ${item.gardiner}`}
                    >
                      <span className="text-3xl text-[#241604] dark:text-[#FFD700] font-normal leading-none py-1">
                        {item.glyph}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#8C6207] dark:text-stone-400 border-t border-stone-200 dark:border-stone-800 w-full text-center mt-1 pt-0.5">
                        {item.char}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-[#8C6207]/70 py-4 italic">
                    {isRtl ? 'اكتب حروفا بالأعلى لمشاهدة النقش الفرعوني' : 'Type letters above to materialize ancient hieroglyphic seals'}
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D1B894]/40">
                <div className="flex items-center gap-2">
                  <KemetButton
                    variant="gold-primary"
                    size="md"
                    icon={copied ? <Check size={16} /> : <Copy size={16} />}
                    onClick={handleCopy}
                  >
                    {copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ العلامات' : 'Copy Glyphs')}
                  </KemetButton>

                  <KemetButton
                    variant="turquoise-primary"
                    size="md"
                    icon={<CartoucheIcon size={18} tone="currentColor" />}
                    onClick={() => onSendToCartouche && onSendToCartouche(inputText, transliteratedResult)}
                  >
                    {isRtl ? 'صنع خرطوش ملكي' : 'Forge Into Cartouche'}
                  </KemetButton>
                </div>

                <KemetButton
                  variant="gold-secondary"
                  size="md"
                  icon={<Volume2 size={16} />}
                  onClick={() => playGoldChime(0.9)}
                >
                  {isRtl ? 'استماع للنغمة' : 'Chime'}
                </KemetButton>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Glyph Anatomical Inspector & Gardiner Sign Table */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Glyph Anatomical Card */}
          <div className="kemet-royal-card dark:kemet-royal-card-dark p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#B8860B]/20 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6207] dark:text-[#FFD700]">
                {isRtl ? 'تشريح العلامة المختارة' : 'Glyph Curatorial Analysis'}
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#B8860B]/20 text-[#8C6207] dark:text-[#FFD700] font-bold">
                {selectedGlyph.gardinerCode}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl gold-medallion flex items-center justify-center text-5xl text-[#241604] shrink-0 shadow-md">
                {selectedGlyph.glyph}
              </div>
              <div className="space-y-1">
                <div className="text-lg font-serif font-bold text-[#3E2723] dark:text-white">
                  {selectedGlyph.transliteration}
                </div>
                <div className="text-xs text-[#6D4C41] dark:text-stone-300 leading-snug">
                  {selectedGlyph.meaning}
                </div>
                <div className="text-[11px] font-mono text-[#8C6207] dark:text-[#FFD700]">
                  Category: {selectedGlyph.category.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <KemetButton
                variant="gold-secondary"
                size="sm"
                isFullWidth
                icon={<Sparkles size={14} />}
                onClick={() => handleInsertGlyphToInput(selectedGlyph)}
              >
                {isRtl ? 'إدراج هذه العلامة في النص' : 'Insert Sign Into Inscription'}
              </KemetButton>
            </div>
          </div>

          {/* Quick Glyph Selection Grid */}
          <div className="kemet-royal-card dark:kemet-royal-card-dark p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#B8860B]/20 pb-2">
              <span className="text-xs font-serif font-bold text-[#3E2723] dark:text-[#FFD700]">
                {isRtl ? 'لوحة المفاتيح الفرعونية' : 'Scribe Sign Palette'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveCategory('uniliteral')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    activeCategory === 'uniliteral'
                      ? 'bg-[#3E2723] text-[#FFD700]'
                      : 'text-[#6D4C41] dark:text-stone-400 hover:text-[#3E2723]'
                  }`}
                >
                  Uniliterals (A-Z)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('symbols')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    activeCategory === 'symbols'
                      ? 'bg-[#3E2723] text-[#FFD700]'
                      : 'text-[#6D4C41] dark:text-stone-400 hover:text-[#3E2723]'
                  }`}
                >
                  Sacred Symbols
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-56 overflow-y-auto p-1">
              {(activeCategory === 'uniliteral' ? UNILITERAL_GLYPHS : SACRED_ROYAL_SYMBOLS).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSelectGlyph(g)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer
                    ${selectedGlyph.id === g.id
                      ? 'bg-[#FFD700]/30 border-2 border-[#B8860B] scale-105'
                      : 'bg-white/60 dark:bg-stone-900 border border-[#D1B894]/50 hover:border-[#B8860B]'}
                  `}
                >
                  <span className="text-2xl text-[#241604] dark:text-[#FFD700] leading-tight">{g.glyph}</span>
                  <span className="text-[10px] font-mono text-[#8C6207] dark:text-stone-400 truncate w-full text-center">
                    {g.id.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
