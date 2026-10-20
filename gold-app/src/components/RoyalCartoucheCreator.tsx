import React, { useState } from 'react';
import { transliterateToHieroglyphs } from '../data/hieroglyphs';
import { KemetButton } from './ui/KemetButton';
import { CartoucheIcon, ScarabIcon, AnkhIcon, EyeOfHorusIcon, FeatherOfMaatIcon } from './ui/EgyptianIcons';
import { playGoldChime, playRoyalFanfare, playStoneTap } from '../utils/audio';
import { Download, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';

interface Props {
  isRtl?: boolean;
  initialName?: string;
}

const PHARAOH_PRESETS = [
  { name: 'TUTANKHAMUN', epithet: 'Nebkheperure (Lord of Manifestations is Ra)', titleGlyph: '𓇳𓆣𓏥' },
  { name: 'RAMSES', epithet: 'Usermaatre-Setepenre (Chosen of Ra)', titleGlyph: '𓇳𓄊𓁧𓇓' },
  { name: 'NEFERTITI', epithet: 'Neferneferuaten (Beautiful are the Beauties of Aten)', titleGlyph: '𓄤𓄤𓄤𓄤𓇍𓍘𓇋' },
  { name: 'HATSHEPSUT', epithet: 'Maatkare (Truth is the Soul of Ra)', titleGlyph: '𓇳𓁧𓂓' },
  { name: 'CLEOPATRA', epithet: 'Philopator (Father-Loving Queen)', titleGlyph: '𓈎𓃭𓇋𓍯𓊪𓂧𓂋𓄿' },
];

export const RoyalCartoucheCreator: React.FC<Props> = ({ isRtl = false, initialName = 'TUTANKHAMUN' }) => {
  const [pharaohName, setPharaohName] = useState(initialName);
  const [selectedTheme, setSelectedTheme] = useState<'gold' | 'lapis' | 'turquoise' | 'papyrus'>('gold');
  const [selectedTitle, setSelectedTitle] = useState<'sa-ra' | 'neb-tawy' | 'nisu-bity'>('sa-ra');
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { glyphs, letters } = transliterateToHieroglyphs(pharaohName);

  const handleApplyPreset = (preset: typeof PHARAOH_PRESETS[0]) => {
    setPharaohName(preset.name);
    playRoyalFanfare();
  };

  const handleCopyTransliteration = () => {
    navigator.clipboard.writeText(`𓍹 ${glyphs} 𓍺`);
    playGoldChime(1.1);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    setDownloading(true);
    playRoyalFanfare();

    setTimeout(() => {
      const svgElement = document.getElementById('kemet-royal-cartouche-svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = `kemet-cartouche-${pharaohName.toLowerCase()}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
      }
      setDownloading(false);
    }, 600);
  };

  // Titles mapping
  const titleLabels = {
    'sa-ra': { glyph: '𓅬𓇳', en: 'Son of Ra (Sa-Ra)', ar: 'ابن رع (سا-رع)' },
    'neb-tawy': { glyph: '𓎟𓇿𓇿', en: 'Lord of Two Lands (Neb-Tawy)', ar: 'سيد الأرضين (نب-تاوي)' },
    'nisu-bity': { glyph: '𓇓𓏏𓊵', en: 'King of Upper & Lower Egypt', ar: 'ملك الوجهين البحري والقبلي' },
  }[selectedTitle];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8860B]/15 border border-[#B8860B]/30 text-xs font-semibold text-[#8C6207] dark:text-[#E6C676] uppercase tracking-wider">
          <CartoucheIcon size={14} tone="gold" />
          <span>{isRtl ? 'مصنع الخراطيش الملكية' : 'Royal Cartouche Forge'}</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#3E2723] dark:text-[#F4EFEA]">
          {isRtl ? 'صياغة الخرطوش الفرعوني والختم الأبدي' : 'Pharaonic Royal Cartouche Forge'}
        </h2>
        <p className="max-w-2xl mx-auto text-sm text-[#6D4C41] dark:text-stone-300">
          {isRtl
            ? 'احفر اسمك داخل حلقة الخلود الملكية (شنو) المحمية برباط الحبل المقدس ونقوش الذهب واللازورد.'
            : 'Enclose your royal name within the sacred Shenu oval of eternity, protected by divine knotwork and precious gem inlays.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="kemet-royal-card dark:kemet-royal-card-dark p-6 space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="cartouche-name" className="block text-xs font-bold uppercase tracking-wider text-[#8C6207] dark:text-[#FFD700]">
                {isRtl ? 'اسم الملك أو الاسم المراد صياغته:' : 'Royal Pharaoh Name:'}
              </label>
              <input
                id="cartouche-name"
                type="text"
                value={pharaohName}
                onChange={(e) => setPharaohName(e.target.value.toUpperCase())}
                placeholder="RAMSES"
                className="w-full h-12 px-4 rounded-xl font-serif text-lg font-bold tracking-widest uppercase bg-white/80 dark:bg-stone-900 border-2 border-[#D1B894] dark:border-stone-700 text-[#3E2723] dark:text-[#FFD700] focus:border-[#B8860B] focus:ring-2 focus:ring-[#FFD700]/30 outline-none"
                maxLength={18}
              />
            </div>

            {/* Quick Historical Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#6D4C41] dark:text-stone-400">
                {isRtl ? 'أشهر أسماء ملوك وملكات مصر القديمة:' : 'Legendary Dynasty Presets:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {PHARAOH_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                      pharaohName === p.name
                        ? 'bg-[#3E2723] text-[#FFD700] shadow-sm'
                        : 'bg-white/70 dark:bg-stone-900 border border-[#D1B894]/70 dark:border-stone-800 text-[#5D4037] dark:text-stone-300 hover:border-[#B8860B]'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Inlay Material Choice */}
            <div className="space-y-2 pt-2 border-t border-[#D1B894]/40">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#8C6207] dark:text-[#FFD700]">
                {isRtl ? 'مادة وخامة الخرطوش:' : 'Precious Inlay Material:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'gold', label: isRtl ? 'ذهب خالص' : 'Pure Gold', bg: 'from-[#FFF4B8] via-[#FFD700] to-[#B8860B]' },
                  { id: 'lapis', label: isRtl ? 'لازورد ملكي' : 'Lapis Lazuli', bg: 'from-[#1E3A8A] to-[#0F172A]' },
                  { id: 'turquoise', label: isRtl ? 'فيروز سيناء' : 'Sinai Turquoise', bg: 'from-[#0CE6E8] to-[#089293]' },
                  { id: 'papyrus', label: isRtl ? 'ورق بردي' : 'Raw Papyrus', bg: 'from-[#FBF7EE] to-[#EBDDC6]' },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      setSelectedTheme(th.id as typeof selectedTheme);
                      playStoneTap();
                    }}
                    className={`
                      p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5
                      ${selectedTheme === th.id 
                        ? 'border-[#B8860B] ring-2 ring-[#FFD700]/50 shadow-md scale-[1.02]' 
                        : 'border-[#D1B894]/60 bg-white/50 dark:bg-stone-900/50 hover:border-[#B8860B]'}
                    `}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${th.bg} border border-black/20 shadow-inner`} />
                    <span className="text-[11px] font-semibold text-[#3E2723] dark:text-stone-200">{th.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Royal Title Choice */}
            <div className="space-y-2 pt-2 border-t border-[#D1B894]/40">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#8C6207] dark:text-[#FFD700]">
                {isRtl ? 'اللقب الملكي المتوج للخرطوش:' : 'Royal Pharaonic Titulary:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'sa-ra', label: isRtl ? 'ابن رع (Sa-Ra)' : 'Son of Ra', glyph: '𓅬𓇳' },
                  { id: 'neb-tawy', label: isRtl ? 'سيد الأرضين' : 'Lord of 2 Lands', glyph: '𓎟𓇿𓇿' },
                  { id: 'nisu-bity', label: isRtl ? 'ملك القطرين' : 'King of Upper/Lower', glyph: '𓇓𓏏𓊵' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTitle(t.id as typeof selectedTitle);
                      playStoneTap();
                    }}
                    className={`
                      p-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2
                      ${selectedTitle === t.id 
                        ? 'bg-[#3E2723] text-[#FFD700] border-[#B8860B]' 
                        : 'bg-white/60 dark:bg-stone-900 border-[#D1B894]/60 text-[#5D4037] dark:text-stone-300 hover:border-[#B8860B]'}
                    `}
                  >
                    <span className="text-lg">{t.glyph}</span>
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons using Kemet luxury button system */}
            <div className="pt-3 border-t border-[#D1B894]/40 flex flex-wrap items-center gap-3">
              <KemetButton
                variant="gold-primary"
                size="md"
                isLoading={downloading}
                onClick={handleDownloadSVG}
                icon={<Download size={18} />}
              >
                {isRtl ? 'تحميل الخرطوش (SVG)' : 'Download Cartouche (SVG)'}
              </KemetButton>

              <KemetButton
                variant="turquoise-primary"
                size="md"
                onClick={handleCopyTransliteration}
                icon={copied ? <Check size={18} /> : <Copy size={18} />}
              >
                {copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الرمز' : 'Copy Shenu Text')}
              </KemetButton>

              <KemetButton
                variant="tertiary"
                size="sm"
                onClick={() => setPharaohName('RAMSES')}
                icon={<RotateCcw size={14} />}
              >
                {isRtl ? 'إعادة ضبط' : 'Reset'}
              </KemetButton>
            </div>
          </div>
        </div>

        {/* Live Dimensional Royal Cartouche Preview (Right Column) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="kemet-royal-card dark:kemet-royal-card-dark p-8 w-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient royal glow backdrop */}
            <div className="absolute inset-0 bg-radial from-[#FFD700]/10 via-transparent to-transparent pointer-events-none" />

            {/* Royal Title Crown Banner */}
            <div className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/80 dark:bg-stone-900 border border-[#B8860B]/40 shadow-sm z-10">
              <span className="text-xl leading-none">{titleLabels.glyph}</span>
              <span className="text-xs font-serif font-bold text-[#8C6207] dark:text-[#FFD700]">
                {isRtl ? titleLabels.ar : titleLabels.en}
              </span>
            </div>

            {/* Sacred Cartouche SVG Element */}
            <div className="relative z-10 p-4 transition-all duration-300">
              <svg
                id="kemet-royal-cartouche-svg"
                width="240"
                height="380"
                viewBox="0 0 240 380"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl"
              >
                <defs>
                  {/* Layered metallic gold rim gradient */}
                  <linearGradient id="goldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF9D2" />
                    <stop offset="25%" stopColor="#FFD700" />
                    <stop offset="55%" stopColor="#C49733" />
                    <stop offset="85%" stopColor="#B8860B" />
                    <stop offset="100%" stopColor="#7A5405" />
                  </linearGradient>

                  {/* Surface background theme gradients */}
                  <linearGradient id="cartoucheBgGold" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFF2B2" />
                    <stop offset="30%" stopColor="#FFE066" />
                    <stop offset="70%" stopColor="#E5B51E" />
                    <stop offset="100%" stopColor="#C69414" />
                  </linearGradient>

                  <linearGradient id="cartoucheBgLapis" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="50%" stopColor="#172554" />
                    <stop offset="100%" stopColor="#0B132B" />
                  </linearGradient>

                  <linearGradient id="cartoucheBgTurquoise" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0CE6E8" />
                    <stop offset="50%" stopColor="#0AB4B5" />
                    <stop offset="100%" stopColor="#089293" />
                  </linearGradient>

                  <linearGradient id="cartoucheBgPapyrus" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FCF8F2" />
                    <stop offset="50%" stopColor="#F5ECE0" />
                    <stop offset="100%" stopColor="#E8D8C3" />
                  </linearGradient>

                  {/* Shadow filter */}
                  <filter id="cartoucheInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
                  </filter>
                </defs>

                {/* Outer Cartouche Oval Rim (The Golden Shenu) */}
                <rect
                  x="20"
                  y="20"
                  width="200"
                  height="300"
                  rx="100"
                  fill={
                    selectedTheme === 'gold' ? 'url(#cartoucheBgGold)' :
                    selectedTheme === 'lapis' ? 'url(#cartoucheBgLapis)' :
                    selectedTheme === 'turquoise' ? 'url(#cartoucheBgTurquoise)' :
                    'url(#cartoucheBgPapyrus)'
                  }
                  stroke="url(#goldRimGrad)"
                  strokeWidth="8"
                  filter="url(#cartoucheInnerShadow)"
                />

                {/* Inner Bevel Border */}
                <rect
                  x="28"
                  y="28"
                  width="184"
                  height="284"
                  rx="92"
                  fill="none"
                  stroke="#FFEC94"
                  strokeWidth="1.5"
                  strokeOpacity="0.75"
                />

                {/* Shen Base Knot Bar */}
                <g id="shen-knot">
                  {/* Horizontal Bar */}
                  <rect
                    x="15"
                    y="324"
                    width="210"
                    height="16"
                    rx="8"
                    fill="url(#goldRimGrad)"
                    stroke="#7A5405"
                    strokeWidth="1.5"
                  />
                  {/* Binding cords */}
                  <line x1="60" y1="324" x2="60" y2="348" stroke="#7A5405" strokeWidth="3" />
                  <line x1="80" y1="324" x2="80" y2="348" stroke="#7A5405" strokeWidth="3" />
                  <line x1="160" y1="324" x2="160" y2="348" stroke="#7A5405" strokeWidth="3" />
                  <line x1="180" y1="324" x2="180" y2="348" stroke="#7A5405" strokeWidth="3" />
                </g>

                {/* Hieroglyphic Inscription Columns */}
                <g id="glyphs-column" textAnchor="middle">
                  {letters.map((item, idx) => {
                    const total = letters.length || 1;
                    const spacing = Math.min(42, 220 / total);
                    const startY = 160 - ((total - 1) * spacing) / 2;
                    const yPos = startY + idx * spacing;
                    const fillClr = 
                      selectedTheme === 'gold' ? '#241604' :
                      selectedTheme === 'lapis' ? '#FFD700' :
                      selectedTheme === 'turquoise' ? '#FFFFFF' :
                      '#3E2723';

                    return (
                      <text
                        key={idx}
                        x="120"
                        y={yPos}
                        fontSize={letters.length > 6 ? '28' : '34'}
                        fill={fillClr}
                        fontFamily="serif"
                        dominantBaseline="middle"
                        filter="drop-shadow(0 1px 1px rgba(0,0,0,0.3))"
                      >
                        {item.glyph}
                      </text>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Pharaoh Name Banner */}
            <div className="mt-4 text-center space-y-1">
              <div className="font-serif font-black text-xl tracking-widest text-[#3E2723] dark:text-[#FFD700]">
                {pharaohName}
              </div>
              <div className="text-xs text-[#6D4C41] dark:text-stone-400 font-mono">
                {letters.map(l => l.gardiner).join(' · ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
