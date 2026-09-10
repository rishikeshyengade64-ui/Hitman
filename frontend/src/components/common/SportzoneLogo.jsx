import React from 'react';

/**
 * High-performance, vector SVG SportZone Athletic Emblem & Wordmark.
 * Precision-crafted for Kinetic Obsidian design system.
 */
export const SportzoneLogo = ({ size = 'md', showText = true, className = '' }) => {
  // Size mappings
  const dimensions = {
    sm: { height: 26, iconSize: 24, fontSize: 'text-lg', zoneSize: 'text-lg', badgeSize: 'text-[8px]' },
    md: { height: 34, iconSize: 32, fontSize: 'text-2xl', zoneSize: 'text-2xl', badgeSize: 'text-[10px]' },
    lg: { height: 44, iconSize: 40, fontSize: 'text-3xl', zoneSize: 'text-3xl', badgeSize: 'text-xs' },
    xl: { height: 56, iconSize: 52, fontSize: 'text-4xl', zoneSize: 'text-4xl', badgeSize: 'text-xs' },
  };

  const config = dimensions[size] || dimensions.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Aerodynamic Kinetic 'S' Athletic Emblem */}
      <svg
        width={config.iconSize}
        height={config.iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_2px_8px_rgba(22,163,74,0.25)] transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="szVoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#84CC16" />
            <stop offset="60%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="szCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Top Wing Chevron */}
        <path
          d="M12 18L32 6L54 6L34 18H12Z"
          fill="url(#szVoltGrad)"
        />
        {/* Upper S-Curve Fin */}
        <path
          d="M8 30L26 19H50L30 30H8Z"
          fill="url(#szVoltGrad)"
        />
        {/* Core High-Velocity Cut */}
        <path
          d="M20 33L42 22H58L36 33H20Z"
          fill="#FFFFFF"
          opacity="0.9"
        />
        {/* Lower S-Curve Fin */}
        <path
          d="M14 45L34 34H56L38 45H14Z"
          fill="url(#szCyanGrad)"
        />
        {/* Bottom Wing Chevron */}
        <path
          d="M10 58L30 46H52L32 58H10Z"
          fill="url(#szCyanGrad)"
        />
        {/* Speed Angle Accent Line */}
        <path
          d="M48 10L24 54"
          stroke="#16A34A"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>

      {/* SportZone Brand Typography */}
      {showText && (
        <div className="flex items-baseline tracking-tighter uppercase font-headline-md font-black">
          <span className={`text-primary ${config.fontSize} tracking-wide italic`}>
            SPORT
          </span>
          <span className={`text-primary-fixed ${config.zoneSize} tracking-wide italic ml-0.5 drop-shadow-[0_1px_4px_rgba(22,163,74,0.25)]`}>
            ZONE
          </span>
        </div>
      )}
    </div>
  );
};

export default SportzoneLogo;
