import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  tone?: 'gold' | 'turquoise' | 'dark' | 'currentColor';
}

export const AnkhIcon: React.FC<IconProps> = ({ 
  size = 20, 
  className = '', 
  tone = 'currentColor',
  ...props 
}) => {
  const getFill = () => {
    if (tone === 'gold') return 'url(#ankhGoldGrad)';
    if (tone === 'turquoise') return '#0AB4B5';
    if (tone === 'dark') return '#3E2723';
    return 'currentColor';
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="ankhGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="40%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      {/* Loop of life */}
      <path 
        d="M12 2C9.23858 2 7 4.23858 7 7C7 9.8 9.5 12 11 13V15H8C7.44772 15 7 15.4477 7 16C7 16.5523 7.44772 17 8 17H11V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V17H16C16.5523 17 17 16.5523 17 16C17 15.4477 16.5523 15 16 15H13V13C14.5 12 17 9.8 17 7C17 4.23858 14.7614 2 12 2ZM12 4C13.6569 4 15 5.34315 15 7C15 8.65685 13.5 10.3 12 11.2C10.5 10.3 9 8.65685 9 7C9 5.34315 10.3431 4 12 4Z" 
        fill={getFill()}
      />
    </svg>
  );
};

export const EyeOfHorusIcon: React.FC<IconProps> = ({ 
  size = 20, 
  className = '', 
  tone = 'currentColor',
  ...props 
}) => {
  const getStroke = () => {
    if (tone === 'gold') return '#B8860B';
    if (tone === 'turquoise') return '#0AB4B5';
    if (tone === 'dark') return '#3E2723';
    return 'currentColor';
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Upper brow */}
      <path d="M2 8C5.5 5 18.5 5 22 8" stroke={getStroke()} strokeWidth="1.8" strokeLinecap="round" />
      {/* Eye contour */}
      <path d="M3 10C7 6.5 17 6.5 21 10C17 13.5 7 13.5 3 10Z" stroke={getStroke()} strokeWidth="1.6" strokeLinejoin="round" />
      {/* Iris */}
      <circle cx="12" cy="10" r="2.5" fill={getStroke()} />
      {/* Falcon tear & spiral markings */}
      <path d="M12 13V19C12 20.5 10.5 21.5 9 21.5" stroke={getStroke()} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 13C16.5 14.5 19 15.5 20 18" stroke={getStroke()} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
};

export const ScarabIcon: React.FC<IconProps> = ({ 
  size = 20, 
  className = '', 
  tone = 'currentColor',
  ...props 
}) => {
  const getFill = () => {
    if (tone === 'gold') return 'url(#scarabGoldGrad)';
    if (tone === 'turquoise') return '#0AB4B5';
    if (tone === 'dark') return '#3E2723';
    return 'currentColor';
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="scarabGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      {/* Sun disk above */}
      <circle cx="12" cy="3.5" r="1.8" fill={getFill()} />
      {/* Head & Clypeus */}
      <path d="M10 6C10 5.2 14 5.2 14 6L14.8 7.5H9.2L10 6Z" fill={getFill()} />
      {/* Pronotum (thorax) */}
      <path d="M8 8.5C8 8.2 16 8.2 16 8.5C16.8 9.5 16.8 11 16 11.5H8C7.2 11 7.2 9.5 8 8.5Z" fill={getFill()} />
      {/* Elytra (wing cases) */}
      <path d="M7.5 12.5C7.5 16.5 9 19.5 11.5 19.5V12.5H7.5Z" fill={getFill()} />
      <path d="M16.5 12.5C16.5 16.5 15 19.5 12.5 19.5V12.5H16.5Z" fill={getFill()} />
      {/* Forelegs */}
      <path d="M7 8C5 6.5 3 7 2 8" stroke={getFill()} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M17 8C19 6.5 21 7 22 8" stroke={getFill()} strokeWidth="1.2" strokeLinecap="round" />
      {/* Midlegs */}
      <path d="M6.5 11C4.5 11.5 3 13 2.5 14" stroke={getFill()} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M17.5 11C19.5 11.5 21 13 21.5 14" stroke={getFill()} strokeWidth="1.2" strokeLinecap="round" />
      {/* Hindlegs */}
      <path d="M7 16C5.5 18 4 19.5 3 21" stroke={getFill()} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M17 16C18.5 18 20 19.5 21 21" stroke={getFill()} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};

export const CartoucheIcon: React.FC<IconProps> = ({ 
  size = 20, 
  className = '', 
  tone = 'currentColor',
  ...props 
}) => {
  const getStroke = () => {
    if (tone === 'gold') return '#B8860B';
    if (tone === 'turquoise') return '#0AB4B5';
    if (tone === 'dark') return '#3E2723';
    return 'currentColor';
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Cartouche Oval Loop */}
      <rect x="7" y="2" width="10" height="16" rx="5" stroke={getStroke()} strokeWidth="1.8" />
      {/* Base Tie Bar (Shen knot line) */}
      <line x1="5" y1="19.5" x2="19" y2="19.5" stroke={getStroke()} strokeWidth="2.2" strokeLinecap="round" />
      {/* Knot binding wraps */}
      <line x1="8" y1="19.5" x2="8" y2="22" stroke={getStroke()} strokeWidth="1.4" />
      <line x1="16" y1="19.5" x2="16" y2="22" stroke={getStroke()} strokeWidth="1.4" />
      {/* Royal inner glyph symbol (Sun disk) */}
      <circle cx="12" cy="7" r="1.5" fill={getStroke()} />
      <line x1="10" y1="11" x2="14" y2="11" stroke={getStroke()} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="11" x2="12" y2="14" stroke={getStroke()} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};

export const PapyrusScrollIcon: React.FC<IconProps> = ({ 
  size = 20, 
  className = '', 
  tone = 'currentColor',
  ...props 
}) => {
  const getStroke = () => {
    if (tone === 'gold') return '#B8860B';
    if (tone === 'turquoise') return '#0AB4B5';
    if (tone === 'dark') return '#3E2723';
    return 'currentColor';
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path 
        d="M6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6Z" 
        stroke={getStroke()} 
        strokeWidth="1.6" 
      />
      {/* Reed roll curl */}
      <path d="M4 6C4 7 5 8 6 8H18C19 8 20 7 20 6" stroke={getStroke()} strokeWidth="1.4" />
      <path d="M4 18C4 17 5 16 6 16H18C19 16 20 17 20 18" stroke={getStroke()} strokeWidth="1.4" />
      {/* Scribe lines */}
      <line x1="8" y1="11" x2="16" y2="11" stroke={getStroke()} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="13.5" x2="14" y2="13.5" stroke={getStroke()} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};

export const FeatherOfMaatIcon: React.FC<IconProps> = ({ 
  size = 20, 
  className = '', 
  tone = 'currentColor',
  ...props 
}) => {
  const getStroke = () => {
    if (tone === 'gold') return '#B8860B';
    if (tone === 'turquoise') return '#0AB4B5';
    if (tone === 'dark') return '#3E2723';
    return 'currentColor';
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Central rachis (shaft) */}
      <path d="M12 21C12 16 13 9 17 3" stroke={getStroke()} strokeWidth="1.8" strokeLinecap="round" />
      {/* Plume vane curve */}
      <path d="M12 21C7 18 6 11 11 4C14 3.5 16.5 3 17 3C15 7 14 13 12 21Z" stroke={getStroke()} strokeWidth="1.4" strokeLinejoin="round" />
      {/* Diagonal barbs */}
      <path d="M9 13L12.5 11" stroke={getStroke()} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M9.8 10L13.5 8" stroke={getStroke()} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M11 7L14.8 5.5" stroke={getStroke()} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
};

export const DjedIcon: React.FC<IconProps> = ({ 
  size = 20, 
  className = '', 
  tone = 'currentColor',
  ...props 
}) => {
  const getStroke = () => {
    if (tone === 'gold') return '#B8860B';
    if (tone === 'turquoise') return '#0AB4B5';
    return 'currentColor';
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Central pillar */}
      <path d="M11 22V2H13V22H11Z" fill={getStroke()} />
      {/* Base */}
      <path d="M8 22H16" stroke={getStroke()} strokeWidth="2" strokeLinecap="round" />
      {/* Four horizontal stability bars */}
      <path d="M6 4H18" stroke={getStroke()} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 7H18" stroke={getStroke()} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 10H18" stroke={getStroke()} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 13H18" stroke={getStroke()} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};

export const PyramidSunIcon: React.FC<IconProps> = ({ 
  size = 20, 
  className = '', 
  tone = 'currentColor',
  ...props 
}) => {
  const getStroke = () => {
    if (tone === 'gold') return '#B8860B';
    if (tone === 'turquoise') return '#0AB4B5';
    return 'currentColor';
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Sun rising between two horizons (Akhet) */}
      <circle cx="12" cy="7" r="3" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
      {/* Pyramid faces */}
      <path d="M12 9L2 21H22L12 9Z" stroke={getStroke()} strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="21" stroke={getStroke()} strokeWidth="1.4" />
    </svg>
  );
};

export const GoldenScarabSpinner: React.FC<{ size?: number; className?: string }> = ({ 
  size = 20, 
  className = '' 
}) => {
  return (
    <div className={`inline-flex items-center justify-center animate-spin ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="rgba(184, 134, 11, 0.25)" strokeWidth="2.5" />
        <path 
          d="M12 3C16.9706 3 21 7.02944 21 12" 
          stroke="url(#spinnerGold)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        <defs>
          <linearGradient id="spinnerGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
