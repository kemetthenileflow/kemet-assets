import React from 'react';

export type KemetIconName =
  | 'home'
  | 'journey'
  | 'library'
  | 'results'
  | 'back'
  | 'next'
  | 'thoth'
  | 'ankh'
  | 'search'
  | 'download'
  | 'close'
  | 'check'
  | 'zoom-in'
  | 'zoom-out'
  | 'fullscreen'
  | 'exit-fullscreen'
  | 'fit-width'
  | 'vocabulary'
  | 'grammar'
  | 'story'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'challenge'
  | 'game'
  | 'pdf'
  | 'audio'
  | 'play'
  | 'pause'
  | 'mic'
  | 'record'
  | 'youtube'
  | 'video'
  | 'lotus'
  | 'scarab'
  | 'wedjat'
  | 'cartouche'
  | 'pyramids'
  | 'rosetta'
  | 'quiz'
  | 'timer'
  | 'hint'
  | 'eye'
  | 'transcript'
  | 'star'
  | 'reset'
  | 'sound-wave'
  | 'help';

interface KemetIconProps {
  name: KemetIconName;
  size?: number | string;
  className?: string;
  title?: string;
  variant?: 'gold' | 'turquoise' | 'lapis' | 'bronze' | 'default';
}

export function KemetIcon({
  name,
  size = 20,
  className = '',
  title,
  variant = 'default',
}: KemetIconProps) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  // Shared SVG Gradients defined in defs
  const gradients = (
    <defs>
      {/* 3D Sculpted Pharaonic Gold */}
      <linearGradient id="kemet-grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2B2" />
        <stop offset="28%" stopColor="#E5B942" />
        <stop offset="70%" stopColor="#B37C1B" />
        <stop offset="100%" stopColor="#7E540C" />
      </linearGradient>

      {/* 3D Lapis & Turquoise Enamel */}
      <linearGradient id="kemet-grad-turquoise" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5CF2F2" />
        <stop offset="30%" stopColor="#0EA5B3" />
        <stop offset="75%" stopColor="#006670" />
        <stop offset="100%" stopColor="#003E44" />
      </linearGradient>

      {/* Sacred Lapis Lazuli Deep Blue */}
      <linearGradient id="kemet-grad-lapis" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64B5F6" />
        <stop offset="35%" stopColor="#1E88E5" />
        <stop offset="75%" stopColor="#0D47A1" />
        <stop offset="100%" stopColor="#08295E" />
      </linearGradient>

      {/* Ancient Temple Bronze / Copper */}
      <linearGradient id="kemet-grad-bronze" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5CBA7" />
        <stop offset="35%" stopColor="#D35400" />
        <stop offset="75%" stopColor="#A04000" />
        <stop offset="100%" stopColor="#6E2C00" />
      </linearGradient>

      {/* Papyrus Reed Parchment */}
      <linearGradient id="kemet-grad-papyrus" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFDF7" />
        <stop offset="50%" stopColor="#F4E8C1" />
        <stop offset="100%" stopColor="#DEC79B" />
      </linearGradient>

      {/* YouTube Crimson / Carnelian */}
      <linearGradient id="kemet-grad-youtube" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF4A4A" />
        <stop offset="50%" stopColor="#CC0000" />
        <stop offset="100%" stopColor="#800000" />
      </linearGradient>

      {/* Subtle 3D Drop Shadow */}
      <filter id="kemet-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#0D131A" floodOpacity="0.35" />
      </filter>
    </defs>
  );

  const renderIcon = () => {
    switch (name) {
      case 'home':
        // Egyptian pylon gateway / home
        return (
          <g filter="url(#kemet-shadow)">
            {/* Pylon cornices */}
            <path d="M2 10 L6 3 L18 3 L22 10 L19 10 L19 21 L14 21 L14 14 L10 14 L10 21 L5 21 L5 10 Z" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="1" strokeLinejoin="round" />
            <path d="M5 3 L19 3 L18 5 L6 5 Z" fill="url(#kemet-grad-turquoise)" />
            {/* Sun disc above portal */}
            <circle cx="12" cy="9" r="2.2" fill="url(#kemet-grad-gold)" stroke="#7E540C" strokeWidth="0.8" />
          </g>
        );

      case 'journey':
        // Winged sun & compass path
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="12" cy="12" r="9" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="1.6" />
            <path d="M12 4 L14.5 10.5 L20 12 L14.5 13.5 L12 20 L9.5 13.5 L4 12 L9.5 10.5 Z" fill="url(#kemet-grad-turquoise)" stroke="#553E18" strokeWidth="0.8" />
            <circle cx="12" cy="12" r="2.5" fill="url(#kemet-grad-gold)" />
          </g>
        );

      case 'library':
        // Alexandrian scroll & codex
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M4 19.5 A2.5 2.5 0 0 1 6.5 17 H20" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2" strokeLinecap="round" />
            <path d="M6.5 2 H20 V22 H6.5 A2.5 2.5 0 0 1 4 19.5 V4.5 A2.5 2.5 0 0 1 6.5 2 z" fill="url(#kemet-grad-papyrus)" stroke="#553E18" strokeWidth="1.2" />
            <path d="M8 6 H16 M8 10 H16 M8 14 H13" stroke="url(#kemet-grad-turquoise)" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="16" cy="14" r="1.5" fill="url(#kemet-grad-gold)" />
          </g>
        );

      case 'results':
        // Progress chart with solar beacon
        return (
          <g filter="url(#kemet-shadow)">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#kemet-grad-papyrus)" stroke="#553E18" strokeWidth="1" />
            <path d="M6 17 L6 13" stroke="url(#kemet-grad-turquoise)" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M10 17 L10 10" stroke="url(#kemet-grad-turquoise)" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M14 17 L14 7" stroke="url(#kemet-grad-gold)" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M18 17 L18 5" stroke="url(#kemet-grad-gold)" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="18" cy="5" r="1.8" fill="#E5B942" />
          </g>
        );

      case 'back':
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M19 12 H5 M11 6 L5 12 L11 18" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="12" r="1.5" fill="url(#kemet-grad-turquoise)" />
          </g>
        );

      case 'next':
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="12" r="1.5" fill="url(#kemet-grad-turquoise)" />
          </g>
        );

      case 'thoth':
        // Sacred Thoth Ibis head & scribe stylus
        return (
          <g filter="url(#kemet-shadow)">
            {/* Lunar crescent & sun disc */}
            <circle cx="12" cy="6" r="3.2" fill="url(#kemet-grad-gold)" />
            <path d="M8.8 6 A3.2 3.2 0 0 0 15.2 6 Z" fill="url(#kemet-grad-turquoise)" />
            {/* Ibis curved beak and head */}
            <path d="M14 11 C11 10 9 12 7 14 C5 16 3 20 2 21 C5 20 8 18 10 16 C12 14 14 13 16 14 C18 15 19 18 19 21 L21 21 C21 16 18 12 14 11 Z" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.8" />
            {/* Eye of knowledge */}
            <circle cx="13" cy="12.5" r="1" fill="#003E44" />
          </g>
        );

      case 'ankh':
        // Key of Life
        return (
          <g filter="url(#kemet-shadow)">
            <ellipse cx="12" cy="7.5" rx="3.5" ry="4.5" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2" />
            <line x1="6" y1="13" x2="18" y2="13" stroke="url(#kemet-grad-gold)" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="12" x2="12" y2="22" stroke="url(#kemet-grad-gold)" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="12" cy="13" r="1.2" fill="url(#kemet-grad-turquoise)" />
          </g>
        );

      case 'search':
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="11" cy="11" r="7" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21.5" y2="21.5" stroke="url(#kemet-grad-gold)" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M8 9 A3.5 3.5 0 0 1 12 7.5" fill="none" stroke="url(#kemet-grad-turquoise)" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'download':
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M12 3 L12 15 M7 10 L12 15 L17 10" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 17 L4 20 A1 1 0 0 0 5 21 L19 21 A1 1 0 0 0 20 20 L20 17" fill="none" stroke="url(#kemet-grad-turquoise)" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'close':
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="12" cy="12" r="9" fill="url(#kemet-grad-papyrus)" stroke="#553E18" strokeWidth="1" />
            <line x1="8" y1="8" x2="16" y2="16" stroke="url(#kemet-grad-gold)" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="8" x2="8" y2="16" stroke="url(#kemet-grad-gold)" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'check':
        return (
          <g filter="url(#kemet-shadow)">
            <polyline points="20 6 9 17 4 12" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );

      case 'zoom-in':
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="11" cy="11" r="7" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21.5" y2="21.5" stroke="url(#kemet-grad-gold)" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="11" y1="8" x2="11" y2="14" stroke="url(#kemet-grad-turquoise)" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="11" x2="14" y2="11" stroke="url(#kemet-grad-turquoise)" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'zoom-out':
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="11" cy="11" r="7" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21.5" y2="21.5" stroke="url(#kemet-grad-gold)" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="8" y1="11" x2="14" y2="11" stroke="url(#kemet-grad-turquoise)" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'fullscreen':
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M4 8 L4 4 L8 4 M16 4 L20 4 L20 8 M20 16 L20 20 L16 20 M8 20 L4 20 L4 16" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );

      case 'exit-fullscreen':
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M8 4 L8 8 L4 8 M16 4 L16 8 L20 8 M16 20 L16 16 L20 16 M8 20 L8 16 L4 16" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );

      case 'fit-width':
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M2 12 H22 M6 8 L2 12 L6 16 M18 8 L22 12 L18 16" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );

      case 'vocabulary':
        // Word tablet / vault with cartouche border
        return (
          <g filter="url(#kemet-shadow)">
            <rect x="3" y="4" width="18" height="16" rx="4" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.8" />
            <path d="M7 8 L10 16 M13 8 L10 16 M8.2 13 H11.8" stroke="#00535B" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M15 10 A2 2 0 0 1 17 12 C17 14 15 16 14 16" fill="none" stroke="#B37C1B" strokeWidth="1.4" strokeLinecap="round" />
            {/* Hieroglyph decorative notch */}
            <circle cx="12" cy="4" r="1.2" fill="url(#kemet-grad-turquoise)" />
          </g>
        );

      case 'grammar':
        // Step Pyramid grammatical layers
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M10 4 H14 L15 7 H9 Z" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.6" />
            <path d="M8 7 H16 L17 11 H7 Z" fill="url(#kemet-grad-turquoise)" stroke="#553E18" strokeWidth="0.6" />
            <path d="M6 11 H18 L19 15 H5 Z" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.6" />
            <path d="M4 15 H20 L21 20 H3 Z" fill="url(#kemet-grad-bronze)" stroke="#553E18" strokeWidth="0.6" />
          </g>
        );

      case 'story':
        // Open illustrated book / adventure quest
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M2 5 C5 4 8 4 12 6 C16 4 19 4 22 5 V19 C19 18 16 18 12 20 C8 18 5 18 2 19 Z" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.4" />
            <path d="M12 6 V20" stroke="url(#kemet-grad-gold)" strokeWidth="1.6" />
            <circle cx="7" cy="11" r="2" fill="url(#kemet-grad-turquoise)" />
            <path d="M15 10 H19 M15 13 H19 M15 16 H17" stroke="#553E18" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        );

      case 'reading':
        // Scribe papyrus scroll
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M5 4 C4 4 3 5 3 6 C3 7 4 8 5 8 H19 C20 8 21 7 21 6 C21 5 20 4 19 4 Z" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.8" />
            <rect x="4" y="6" width="16" height="12" fill="url(#kemet-grad-papyrus)" stroke="#553E18" strokeWidth="0.8" />
            <path d="M5 18 C4 18 3 19 3 20 C3 21 4 22 5 22 H19 C20 22 21 21 21 20 C21 19 20 18 19 18 Z" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.8" />
            <path d="M7 10 H17 M7 14 H14" stroke="url(#kemet-grad-turquoise)" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        );

      case 'listening':
        // Headphones with Egyptian sun-disc detail
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M3 14 V12 A9 9 0 0 1 21 12 V14" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2.2" strokeLinecap="round" />
            <rect x="2" y="13" width="4" height="7" rx="2" fill="url(#kemet-grad-turquoise)" stroke="#553E18" strokeWidth="0.8" />
            <rect x="18" y="13" width="4" height="7" rx="2" fill="url(#kemet-grad-turquoise)" stroke="#553E18" strokeWidth="0.8" />
            <circle cx="12" cy="3" r="1.5" fill="url(#kemet-grad-gold)" />
          </g>
        );

      case 'speaking':
        // Dialogue bubbles with hieroglyphic acoustic rings
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M4 14 L2 18 L7 17 A8 8 0 0 0 16 14 A8 8 0 0 0 8 6 A8 8 0 0 0 4 14 Z" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.5" />
            <circle cx="8" cy="11" r="1" fill="#00535B" />
            <circle cx="11" cy="11" r="1" fill="#00535B" />
            <circle cx="14" cy="11" r="1" fill="#00535B" />
          </g>
        );

      case 'writing':
        // Scribe reed pen and ink stone
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M18 2 L22 6 L9 19 L4 20 L5 15 Z" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="1" strokeLinejoin="round" />
            <path d="M4 20 L7 19 L5 17 Z" fill="#0D131A" />
            <line x1="15" y1="5" x2="19" y2="9" stroke="url(#kemet-grad-turquoise)" strokeWidth="1.2" />
          </g>
        );

      case 'challenge':
        // Crossed bronze khopesh swords / challenge arena
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="12" cy="12" r="9.5" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.6" />
            <path d="M7 17 L17 7 M7 7 L17 17" stroke="url(#kemet-grad-bronze)" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2.5" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.8" />
          </g>
        );

      case 'game':
        // Game controller with cartouche styling
        return (
          <g filter="url(#kemet-shadow)">
            <rect x="2" y="6" width="20" height="12" rx="6" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="1" />
            <path d="M6 12 H10 M8 10 V14" stroke="#003E44" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="15" cy="10.5" r="1.3" fill="url(#kemet-grad-turquoise)" />
            <circle cx="17.5" cy="13.5" r="1.3" fill="url(#kemet-grad-turquoise)" />
          </g>
        );

      case 'pdf':
        // Canonical PDF with Egyptian seal
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M5 3 H15 L20 8 V20 A2 2 0 0 1 18 22 H5 A2 2 0 0 1 3 20 V5 A2 2 0 0 1 5 3 Z" fill="url(#kemet-grad-papyrus)" stroke="#553E18" strokeWidth="1.2" />
            <path d="M15 3 V8 H20" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.8" />
            {/* Red wax seal */}
            <circle cx="10" cy="14" r="3.2" fill="url(#kemet-grad-youtube)" stroke="#553E18" strokeWidth="0.6" />
            <text x="10" y="16" fontSize="5" fontWeight="bold" fill="#FFF" textAnchor="middle">PDF</text>
          </g>
        );

      case 'audio':
        // Speaker with acoustic soundwaves
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="1" strokeLinejoin="round" />
            <path d="M16 8 A5 5 0 0 1 16 16" fill="none" stroke="url(#kemet-grad-turquoise)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M19 5 A9 9 0 0 1 19 19" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        );

      case 'play':
        // Golden sun-disc play triangle
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="12" cy="12" r="9.5" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.6" />
            <polygon points="10,8 16,12 10,16" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.8" strokeLinejoin="round" />
          </g>
        );

      case 'pause':
        // Twin sacred cedar pillars
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="12" cy="12" r="9.5" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.6" />
            <rect x="9" y="8" width="2.4" height="8" rx="1" fill="url(#kemet-grad-turquoise)" stroke="#553E18" strokeWidth="0.6" />
            <rect x="13" y="8" width="2.4" height="8" rx="1" fill="url(#kemet-grad-turquoise)" stroke="#553E18" strokeWidth="0.6" />
          </g>
        );

      case 'mic':
        // Studio microphone with gold cage
        return (
          <g filter="url(#kemet-shadow)">
            <rect x="9" y="3" width="6" height="10" rx="3" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="1" />
            <path d="M6 10 C6 13.5 8.7 16 12 16 C15.3 16 18 13.5 18 10" fill="none" stroke="url(#kemet-grad-turquoise)" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="12" y1="16" x2="12" y2="21" stroke="url(#kemet-grad-gold)" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="21" x2="16" y2="21" stroke="url(#kemet-grad-gold)" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'record':
        // Carnelian recording beacon
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="12" cy="12" r="9" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="5.5" fill="url(#kemet-grad-youtube)" stroke="#553E18" strokeWidth="0.8" />
          </g>
        );

      case 'youtube':
        // Distinctive YouTube badge with gold sculpted bevel
        return (
          <g filter="url(#kemet-shadow)">
            <rect x="2" y="5" width="20" height="14" rx="4" fill="url(#kemet-grad-youtube)" stroke="url(#kemet-grad-gold)" strokeWidth="1.2" />
            <polygon points="10,8.5 16,12 10,15.5" fill="#FFFFFF" />
          </g>
        );

      case 'video':
        // Video camera with golden lens
        return (
          <g filter="url(#kemet-shadow)">
            <rect x="2" y="6" width="14" height="12" rx="2.5" fill="url(#kemet-grad-turquoise)" stroke="url(#kemet-grad-gold)" strokeWidth="1.2" />
            <polygon points="16,10 22,7 22,17 16,14" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.8" />
            <circle cx="9" cy="12" r="2.5" fill="url(#kemet-grad-gold)" />
          </g>
        );

      case 'lotus':
        // Egyptian Lotus flower
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M12 4 C10 8 9 12 12 18 C15 12 14 8 12 4 Z" fill="url(#kemet-grad-turquoise)" stroke="#553E18" strokeWidth="0.6" />
            <path d="M12 18 C8 15 5 12 6 8 C9 9 11 13 12 18 Z" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.6" />
            <path d="M12 18 C16 15 19 12 18 8 C15 9 13 13 12 18 Z" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.6" />
            <path d="M8 20 H16" stroke="url(#kemet-grad-turquoise)" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'scarab':
        // Sacred scarab beetle
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="12" cy="4" r="2.2" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.6" />
            <ellipse cx="12" cy="13" rx="5" ry="6.5" fill="url(#kemet-grad-turquoise)" stroke="#553E18" strokeWidth="0.8" />
            <line x1="12" y1="6.5" x2="12" y2="19.5" stroke="url(#kemet-grad-gold)" strokeWidth="1.2" />
            {/* Legs */}
            <path d="M7 10 L4 9 M7 14 L3 14 M7 17 L4 19 M17 10 L20 9 M17 14 L21 14 M17 17 L20 19" stroke="url(#kemet-grad-gold)" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        );

      case 'wedjat':
        // Eye of Horus (Wedjat)
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M3 11 C6 7 14 7 21 11 C17 15 8 15 3 11 Z" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.4" />
            <circle cx="12" cy="11" r="2.8" fill="url(#kemet-grad-turquoise)" stroke="#0D131A" strokeWidth="0.8" />
            <circle cx="12" cy="11" r="1.2" fill="#0D131A" />
            {/* Falcon tear markings */}
            <path d="M10 14 V19 M14 14 C14 17 17 19 19 19" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        );

      case 'cartouche':
        // Royal cartouche oval
        return (
          <g filter="url(#kemet-shadow)">
            <rect x="7" y="2" width="10" height="17" rx="5" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.6" />
            <line x1="5" y1="21" x2="19" y2="21" stroke="url(#kemet-grad-gold)" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="12" cy="8" r="1.2" fill="url(#kemet-grad-turquoise)" />
            <circle cx="12" cy="13" r="1.2" fill="url(#kemet-grad-turquoise)" />
          </g>
        );

      case 'pyramids':
        // Three Pyramids silhouette
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="19" cy="5" r="2.5" fill="url(#kemet-grad-gold)" />
            {/* Great Pyramid */}
            <polygon points="3,19 10,7 17,19" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.8" />
            {/* Khafre */}
            <polygon points="12,19 18,9 23,19" fill="url(#kemet-grad-bronze)" stroke="#553E18" strokeWidth="0.8" />
            <line x1="2" y1="19" x2="23" y2="19" stroke="#553E18" strokeWidth="1.4" />
          </g>
        );

      case 'rosetta':
        // Trilingual stele
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M5 4 C5 3 6 2 8 2 H16 C18 2 19 3 19 4 V21 H5 Z" fill="#2E3A46" stroke="url(#kemet-grad-gold)" strokeWidth="1.2" />
            {/* Hieroglyphic register */}
            <line x1="7" y1="6" x2="17" y2="6" stroke="#E5B942" strokeWidth="1" strokeDasharray="1,1" />
            <line x1="7" y1="9" x2="17" y2="9" stroke="#E5B942" strokeWidth="1" strokeDasharray="1,1" />
            {/* Demotic register */}
            <line x1="7" y1="12" x2="17" y2="12" stroke="#5CF2F2" strokeWidth="0.8" strokeDasharray="2,1" />
            <line x1="7" y1="14" x2="17" y2="14" stroke="#5CF2F2" strokeWidth="0.8" strokeDasharray="2,1" />
            {/* Greek register */}
            <line x1="7" y1="17" x2="17" y2="17" stroke="#FFF" strokeWidth="0.8" strokeDasharray="3,1" />
            <line x1="7" y1="19" x2="15" y2="19" stroke="#FFF" strokeWidth="0.8" strokeDasharray="3,1" />
          </g>
        );

      case 'quiz':
        // Egyptian papyrus questionnaire with gold checks
        return (
          <g filter="url(#kemet-shadow)">
            <rect x="3" y="3" width="18" height="18" rx="3.5" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.4" />
            <path d="M7 8 L9 10 L13 6" fill="none" stroke="url(#kemet-grad-turquoise)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="14" y1="9" x2="18" y2="9" stroke="url(#kemet-grad-gold)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 14 L9 16 L13 12" fill="none" stroke="url(#kemet-grad-turquoise)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="14" y1="15" x2="18" y2="15" stroke="url(#kemet-grad-gold)" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'timer':
        // Egyptian solar sun-dial & hourglass
        return (
          <g filter="url(#kemet-shadow)">
            <circle cx="12" cy="12" r="9" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.8" />
            <line x1="12" y1="12" x2="12" y2="7" stroke="url(#kemet-grad-turquoise)" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="12" x2="16" y2="12" stroke="url(#kemet-grad-gold)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="1.8" fill="url(#kemet-grad-gold)" />
            {/* Top crown notch */}
            <path d="M10 2 H14" stroke="url(#kemet-grad-gold)" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        );

      case 'hint':
        // Solar spark of divine insight
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M9 18 H15 M10 21 H14" stroke="url(#kemet-grad-gold)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 3 A6 6 0 0 0 6 9 C6 12 8 13.5 9 15 H15 C16 13.5 18 12 18 9 A6 6 0 0 0 12 3 Z" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.5" />
            <circle cx="12" cy="9" r="2.5" fill="url(#kemet-grad-turquoise)" />
            <line x1="12" y1="1" x2="12" y2="2" stroke="url(#kemet-grad-gold)" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'eye':
        // All-seeing eye of insight / reveal
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M2 12 C5 6 19 6 22 12 C19 18 5 18 2 12 Z" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="3.2" fill="url(#kemet-grad-turquoise)" stroke="#003E44" strokeWidth="0.8" />
            <circle cx="12" cy="12" r="1.3" fill="#0D131A" />
          </g>
        );

      case 'transcript':
        // Scribe script sheet with phonetic lines
        return (
          <g filter="url(#kemet-shadow)">
            <rect x="4" y="3" width="16" height="18" rx="2" fill="url(#kemet-grad-papyrus)" stroke="url(#kemet-grad-gold)" strokeWidth="1.4" />
            <line x1="7" y1="7" x2="17" y2="7" stroke="url(#kemet-grad-turquoise)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="11" x2="17" y2="11" stroke="url(#kemet-grad-gold)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="15" x2="14" y2="15" stroke="url(#kemet-grad-turquoise)" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'star':
        // Sacred Sirius star of Isis
        return (
          <g filter="url(#kemet-shadow)">
            <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" fill="url(#kemet-grad-gold)" stroke="#553E18" strokeWidth="0.8" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="1.5" fill="url(#kemet-grad-turquoise)" />
          </g>
        );

      case 'reset':
        // Solar renewal cycle / refresh arrow
        return (
          <g filter="url(#kemet-shadow)">
            <path d="M20 12 A8 8 0 1 1 17.5 6.3 L20 4 V10 H14" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="2" fill="url(#kemet-grad-turquoise)" />
          </g>
        );

      case 'sound-wave':
        // Harmonic acoustic waveform bars
        return (
          <g filter="url(#kemet-shadow)">
            <line x1="4" y1="10" x2="4" y2="14" stroke="url(#kemet-grad-gold)" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="8" y1="7" x2="8" y2="17" stroke="url(#kemet-grad-turquoise)" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="12" y1="4" x2="12" y2="20" stroke="url(#kemet-grad-gold)" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="16" y1="7" x2="16" y2="17" stroke="url(#kemet-grad-turquoise)" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="20" y1="10" x2="20" y2="14" stroke="url(#kemet-grad-gold)" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        );

      case 'help':
        // Ankh key of wisdom and help
        return (
          <g filter="url(#kemet-shadow)">
            <ellipse cx="12" cy="7.5" rx="3.5" ry="4.5" fill="none" stroke="url(#kemet-grad-gold)" strokeWidth="2" />
            <line x1="6" y1="13" x2="18" y2="13" stroke="url(#kemet-grad-gold)" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="12" x2="12" y2="22" stroke="url(#kemet-grad-gold)" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="12" cy="13" r="1.2" fill="url(#kemet-grad-turquoise)" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <span
      className={`kemet-icon-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: pixelSize,
        height: pixelSize,
        lineHeight: 0,
        verticalAlign: 'middle',
      }}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      aria-label={title}
    >
      <svg
        viewBox="0 0 24 24"
        width={pixelSize}
        height={pixelSize}
        style={{ overflow: 'visible' }}
      >
        {gradients}
        {renderIcon()}
      </svg>
    </span>
  );
}
