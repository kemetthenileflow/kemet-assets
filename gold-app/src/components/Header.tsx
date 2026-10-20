import React, { useState } from 'react';
import { KemetButton } from './ui/KemetButton';
import { ScarabIcon, AnkhIcon } from './ui/EgyptianIcons';
import { Globe, Volume2, VolumeX, Moon, Sun, Menu, X } from 'lucide-react';
import { setSoundEnabled, getSoundEnabled, playGoldChime } from '../utils/audio';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRtl: boolean;
  setIsRtl: (val: boolean) => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  isRtl,
  setIsRtl,
  isDark,
  setIsDark,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(getSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playGoldChime(1.0);
  };

  const navLinks = [
    { id: 'curriculum', label: isRtl ? 'المنهج' : 'Curriculum' },
    { id: 'media', label: isRtl ? 'مكتبة الوسائط' : 'Media Library' },
    { id: 'progress', label: isRtl ? 'تقدمي' : 'My Progress' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F4EFEA]/95 dark:bg-[#141210]/95 backdrop-blur-md border-b border-[#D1B894] dark:border-stone-800 transition-colors">
      <div className="egyptian-frieze-top w-full" />
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="text-xl sm:text-2xl font-serif font-black tracking-widest text-[#3E2723] dark:text-[#FFD700] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full gold-medallion flex items-center justify-center shrink-0">
            <AnkhIcon size={16} tone="dark" />
          </div>
          <span>KEMET</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-serif font-semibold text-[#6D4C41] dark:text-stone-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              aria-current={activeTab === link.id ? 'page' : undefined}
              type="button"
              onClick={() => setActiveTab(link.id)}
              className={`
                whitespace-nowrap shrink-0 py-1 transition-colors cursor-pointer relative
                ${activeTab === link.id
                  ? 'text-[#B8860B] dark:text-[#FFD700] font-bold'
                  : 'hover:text-[#3E2723] dark:hover:text-white'}
              `}
            >
              {link.label}
              {activeTab === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B8860B] dark:bg-[#FFD700] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + compact utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick utility controls */}
          <button
            type="button"
            onClick={() => {
              setIsRtl(!isRtl);
              playGoldChime(1.1);
            }}
            aria-label={isRtl ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
            className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold font-serif text-[#3E2723] dark:text-[#FFD700] bg-white/70 dark:bg-stone-900 border border-[#D1B894] hover:border-[#B8860B] transition-colors cursor-pointer"
            title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            {isRtl ? 'EN' : 'عربي'}
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={isRtl ? 'تبديل الصوت' : 'Toggle Sound'}
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#6D4C41] dark:text-stone-300 bg-white/70 dark:bg-stone-900 border border-[#D1B894] hover:border-[#B8860B] transition-colors cursor-pointer"
            title={isRtl ? (soundOn ? 'كتم الصوت' : 'تشغيل الصوت') : (soundOn ? 'Mute Sounds' : 'Enable Chimes')}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            aria-label={isRtl ? 'تبديل التباين' : 'Toggle Contrast'}
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#6D4C41] dark:text-stone-300 bg-white/70 dark:bg-stone-900 border border-[#D1B894] hover:border-[#B8860B] transition-colors cursor-pointer"
            title={isRtl ? (isDark ? 'الوضع النهاري' : 'الوضع الليلي') : (isDark ? 'Switch to Papyrus Day' : 'Switch to Obsidian Night')}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Primary Action Button */}
          <div className="hidden sm:inline-flex">
            <KemetButton
              variant="gold-primary"
              size="sm"
              icon={<ScarabIcon size={14} tone="dark" />}
              onClick={() => setActiveTab('curriculum')}
            >
              {isRtl ? 'ابدأ التعلم' : 'Start Learning'}
            </KemetButton>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center text-[#3E2723] dark:text-stone-200 border border-[#D1B894] cursor-pointer"
            aria-label={isRtl ? 'القائمة الرئيسية' : 'Open Navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-6 py-4 bg-[#F4EFEA] dark:bg-[#141210] border-t border-[#D1B894] dark:border-stone-800 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              aria-current={activeTab === link.id ? 'page' : undefined}
              type="button"
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`
                w-full text-start py-2 font-serif text-sm font-semibold transition-colors
                ${activeTab === link.id ? 'text-[#B8860B] font-bold' : 'text-[#6D4C41] dark:text-stone-300'}
              `}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <KemetButton
              variant="gold-primary"
              size="md"
              isFullWidth
              icon={<ScarabIcon size={16} tone="dark" />}
              onClick={() => {
                setActiveTab('curriculum');
                setMobileMenuOpen(false);
              }}
            >
              {isRtl ? 'ابدأ التعلم' : 'Start Learning'}
            </KemetButton>
          </div>
        </div>
      )}
    </header>
  );
};
