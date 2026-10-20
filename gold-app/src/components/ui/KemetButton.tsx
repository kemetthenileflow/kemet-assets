import React from 'react';
import { KemetButtonProps } from '../../types/kemet';
import { GoldenScarabSpinner } from './EgyptianIcons';
import { playGoldChime, playStoneTap } from '../../utils/audio';

export const KemetButton: React.FC<KemetButtonProps> = ({
  children,
  variant = 'gold-primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  isFullWidth = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    
    // Play tactile sound effect
    if (variant === 'gold-primary') {
      playGoldChime(1.0);
    } else if (variant === 'turquoise-primary') {
      playGoldChime(1.15);
    } else {
      playStoneTap();
    }

    if (onClick) {
      onClick(e);
    }
  };

  // Base sizing matrix
  const sizeClasses = {
    sm: 'h-9 px-3.5 text-xs min-h-[36px] min-w-[36px]',
    md: 'h-11 px-5 text-sm min-h-[44px]', // WCAG touch target >= 44px
    lg: 'h-13 px-7 text-base min-h-[52px]',
  }[size];

  // Variant classes
  const variantClasses = {
    'gold-primary': 'btn-gold-3d text-[#241604] focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2',
    'turquoise-primary': 'btn-turquoise-3d text-white focus-visible:ring-2 focus-visible:ring-[#0AB4B5] focus-visible:ring-offset-2',
    'gold-secondary': 'btn-secondary-gold text-[#684605] dark:text-[#E2C376] dark:bg-stone-900/80 focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2',
    'tertiary': 'btn-tertiary-kemet text-[#5D4037] dark:text-stone-300 focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2',
  }[variant];

  // Disabled styling
  const disabledClasses = disabled 
    ? 'opacity-40 cursor-not-allowed transform-none hover:transform-none shadow-none filter grayscale-[30%]' 
    : 'cursor-pointer active:scale-[0.98]';

  const widthClass = isFullWidth ? 'w-full' : '';

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2.5 font-medium
        transition-all duration-150 ease-out outline-none select-none
        whitespace-nowrap shrink-0
        ${sizeClasses}
        ${variantClasses}
        ${disabledClasses}
        ${widthClass}
        ${className}
      `}
      {...props}
    >
      {/* Specular sheen overlay */}
      <span 
        className="pointer-events-none absolute inset-0 rounded-full overflow-hidden opacity-30" 
        aria-hidden="true"
      >
        <span className="absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 group-hover:translate-x-[300%] transition-transform duration-700 ease-in-out" />
      </span>

      {isLoading ? (
        <>
          <GoldenScarabSpinner size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          <span className="relative z-10">{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="relative z-10 inline-flex shrink-0">{icon}</span>
          )}
          <span className="relative z-10">{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="relative z-10 inline-flex shrink-0">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};
