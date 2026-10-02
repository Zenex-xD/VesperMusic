import React from 'react';

export type NavIconType = 'home' | 'search' | 'library' | 'settings';

interface NavSquircleIconProps {
  type: NavIconType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isActive?: boolean;
}

export const NavSquircleIcon: React.FC<NavSquircleIconProps> = ({
  type,
  size = 'md',
  className = '',
  isActive = false,
}) => {
  const sizeMap = {
    sm: { container: 'w-6 h-6', rounded: 'rounded-[7px]' },
    md: { container: 'w-8 h-8', rounded: 'rounded-[10px]' },
    lg: { container: 'w-11 h-11', rounded: 'rounded-[14px]' },
    xl: { container: 'w-16 h-16', rounded: 'rounded-[20px]' },
  }[size];

  // Unique ID prefix for gradients to prevent SVG clashes across multiple icons
  const id = `sq-${type}-${size}`;

  return (
    <div
      className={`relative ${sizeMap.container} flex items-center justify-center flex-shrink-0 select-none ${sizeMap.rounded} ${
        isActive ? 'ring-1 ring-purple-400/40' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 block overflow-visible"
      >
        <defs>
          {/* Deep Midnight Purple Nocturnal Canvas */}
          <linearGradient id={`${id}-nightSky`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1236" />
            <stop offset="45%" stopColor="#150d2c" />
            <stop offset="100%" stopColor="#0b0619" />
          </linearGradient>

          {/* Squircle Crisp Highlight Rim */}
          <linearGradient id={`${id}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3f0ff" />
            <stop offset="40%" stopColor="#d8b4fe" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>

          {/* Frosted 3D Lavender-White Tone for Artwork Elements */}
          <linearGradient id={`${id}-frosted3D`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#ece7fe" />
            <stop offset="70%" stopColor="#c5b6fd" />
            <stop offset="100%" stopColor="#8d7bbd" />
          </linearGradient>

          {/* Frosted Top Accent Cap */}
          <linearGradient id={`${id}-frostedCap`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ece7fe" />
          </linearGradient>

          {/* Shadow filter for depth */}
          <filter id={`${id}-dropShadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#070312" floodOpacity="0.55" />
          </filter>

          {/* Clip path for squircle */}
          <clipPath id={`${id}-clip`}>
            <rect x="5" y="5" width="90" height="90" rx="23" ry="23" />
          </clipPath>
        </defs>

        {/* Squircle Background */}
        <g clipPath={`url(#${id}-clip)`}>
          <rect x="5" y="5" width="90" height="90" fill={`url(#${id}-nightSky)`} />

          {/* ========================================================================= */}
          {/* 1. HOME ICON (Nocturnal Silhouette House, Moon, Layered Dunes)             */}
          {/* ========================================================================= */}
          {type === 'home' && (
            <g>
              {/* Celestial Moon */}
              <circle cx="73" cy="27" r="8" fill="#ffffff" />

              {/* Chimney */}
              <path d="M 59 36 L 66 36 L 66 48 L 59 44 Z" fill="#2c1d56" />
              <line x1="58.5" y1="36" x2="66.5" y2="36" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

              {/* House Body */}
              <path d="M 33 48.5 L 49 35.5 L 65 48.5 L 65 67 L 33 67 Z" fill="#25174d" />
              {/* Roof Highlight */}
              <path d="M 31 49 L 49 35 L 67 49" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="33" y1="48.5" x2="33" y2="65" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="65" y1="48.5" x2="65" y2="65" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />

              {/* Illuminated Arched Doorway */}
              <path d="M 45 66 L 45 54 C 45 51.5 47 49.5 49.5 49.5 C 52 49.5 54 51.5 54 54 L 54 66 Z" fill="#ffffff" />

              {/* Back Rolling Hill */}
              <path d="M 52 64 C 62 60 74 61 95 72 L 95 95 L 46 95 Z" fill="#7564a2" />

              {/* Foreground Rolling Dune */}
              <path
                d="M 5 68 C 15 57 26 53 43 54 C 58 55 69 63 95 78 L 95 95 L 5 95 Z"
                fill={`url(#${id}-frosted3D)`}
                filter={`url(#${id}-dropShadow)`}
              />
            </g>
          )}

          {/* ========================================================================= */}
          {/* 2. SEARCH ICON (3D Frosted Magnifying Glass with Specular Gleam & Handle)  */}
          {/* ========================================================================= */}
          {type === 'search' && (
            <g filter={`url(#${id}-dropShadow)`}>
              {/* Angled Cylinder Handle (extends towards bottom right) */}
              <path
                d="M 53 59.5 L 68 74.5 C 70.8 77.3 75.2 77.3 78 74.5 C 80.8 71.7 80.8 67.3 78 64.5 L 63 49.5 Z"
                fill={`url(#${id}-frosted3D)`}
              />
              <path
                d="M 53 59.5 L 68 74.5 C 70.8 77.3 75.2 77.3 78 74.5 C 80.8 71.7 80.8 67.3 78 64.5 L 63 49.5 Z"
                stroke="#ffffff"
                strokeWidth="1"
                strokeOpacity="0.4"
                fill="none"
              />

              {/* Lens Body / Dark Tint Behind Glass */}
              <circle cx="44" cy="44" r="14" fill="#140c2c" />

              {/* Glass Ring (Outer circle cutout) */}
              <path
                d="M 44 23 A 21 21 0 1 0 44 65 A 21 21 0 1 0 44 23 M 44 31 A 13 13 0 1 1 44 57 A 13 13 0 1 1 44 31"
                fill={`url(#${id}-frosted3D)`}
                fillRule="evenodd"
              />

              {/* Crisp Highlight Rim Around Glass Circle */}
              <circle cx="44" cy="44" r="21" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" fill="none" />
              <circle cx="44" cy="44" r="13" stroke="#9333ea" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />

              {/* Specular Crescent Reflection Highlight inside Upper-Left Lens */}
              <path
                d="M 34 44 C 34 38.5 38.5 34 44 34"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* ========================================================================= */}
          {/* 3. LIBRARY ICON (3 Frosted 3D Books with Accent Spine Caps & Leaning Book) */}
          {/* ========================================================================= */}
          {type === 'library' && (
            <g filter={`url(#${id}-dropShadow)`}>
              {/* Book 1 (Leftmost, Tallest Standing Book) */}
              <g>
                <rect x="26" y="26" width="13.5" height="47" rx="4" fill={`url(#${id}-frosted3D)`} />
                {/* Book 1 Top Accent Cap */}
                <path
                  d="M 26 30 C 26 27.8 27.8 26 30 26 L 35.5 26 C 37.7 26 39.5 27.8 39.5 30 L 39.5 33.5 L 26 33.5 Z"
                  fill={`url(#${id}-frostedCap)`}
                />
                <line x1="26" y1="33.5" x2="39.5" y2="33.5" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.9" />
                <rect x="26" y="26" width="13.5" height="47" rx="4" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.35" fill="none" />
              </g>

              {/* Book 2 (Middle Standing Book, Slightly Shorter) */}
              <g>
                <rect x="43.5" y="31.5" width="13.5" height="41.5" rx="4" fill={`url(#${id}-frosted3D)`} />
                {/* Book 2 Top Accent Cap */}
                <path
                  d="M 43.5 35.5 C 43.5 33.3 45.3 31.5 47.5 31.5 L 53 31.5 C 55.2 31.5 57 33.3 57 35.5 L 57 38.5 L 43.5 38.5 Z"
                  fill={`url(#${id}-frostedCap)`}
                />
                <line x1="43.5" y1="38.5" x2="57" y2="38.5" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.9" />
                <rect x="43.5" y="31.5" width="13.5" height="41.5" rx="4" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.35" fill="none" />
              </g>

              {/* Book 3 (Rightmost Leaning Book) */}
              <g transform="translate(68, 73) rotate(16) translate(-68, -73)">
                <rect x="61" y="34.5" width="13.5" height="38.5" rx="4" fill={`url(#${id}-frosted3D)`} />
                {/* Book 3 Top Accent Cap */}
                <path
                  d="M 61 38.5 C 61 36.3 62.8 34.5 65 34.5 L 70.5 34.5 C 72.7 34.5 74.5 36.3 74.5 38.5 L 74.5 41.5 L 61 41.5 Z"
                  fill={`url(#${id}-frostedCap)`}
                />
                <line x1="61" y1="41.5" x2="74.5" y2="41.5" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.9" />
                <rect x="61" y="34.5" width="13.5" height="38.5" rx="4" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.35" fill="none" />
              </g>
            </g>
          )}

          {/* ========================================================================= */}
          {/* 4. SETTINGS ICON (3D Frosted 6-Tooth Cogwheel with Concentric Core)        */}
          {/* ========================================================================= */}
          {type === 'settings' && (
            <g filter={`url(#${id}-dropShadow)`} transform="translate(0, 5)">
              {/* 6-Tooth Smooth Organic Cogwheel Path */}
              <path
                d="
                  M 45 23
                  C 45 21.5 46.5 20.5 48 20.5
                  L 52 20.5
                  C 53.5 20.5 55 21.5 55 23
                  C 55.5 25.5 58 27 60.5 26
                  C 62 25.5 63.5 26 64.5 27
                  L 67.5 30
                  C 68.5 31 69 32.5 68.5 34
                  C 67.5 36.5 69 39 71.5 39.5
                  C 73 40 74 41.5 74 43
                  L 74 47
                  C 74 48.5 73 50 71.5 50.5
                  C 69 51 67.5 53.5 68.5 56
                  C 69 57.5 68.5 59 67.5 60
                  L 64.5 63
                  C 63.5 64 62 64.5 60.5 64
                  C 58 63 55.5 64.5 55 67
                  C 55 68.5 53.5 69.5 52 69.5
                  L 48 69.5
                  C 46.5 69.5 45 68.5 45 67
                  C 44.5 64.5 42 63 39.5 64
                  C 38 64.5 36.5 64 35.5 63
                  L 32.5 60
                  C 31.5 59 31 57.5 31.5 56
                  C 32.5 53.5 31 51 28.5 50.5
                  C 27 50 26 48.5 26 47
                  L 26 43
                  C 26 41.5 27 40 28.5 39.5
                  C 31 39 32.5 36.5 31.5 34
                  C 31 32.5 31.5 31 32.5 30
                  L 35.5 27
                  C 36.5 26 38 25.5 39.5 26
                  C 42 27 44.5 25.5 45 23
                  Z
                "
                fill={`url(#${id}-frosted3D)`}
              />
              <path
                d="
                  M 45 23
                  C 45 21.5 46.5 20.5 48 20.5
                  L 52 20.5
                  C 53.5 20.5 55 21.5 55 23
                  C 55.5 25.5 58 27 60.5 26
                  C 62 25.5 63.5 26 64.5 27
                  L 67.5 30
                  C 68.5 31 69 32.5 68.5 34
                  C 67.5 36.5 69 39 71.5 39.5
                  C 73 40 74 41.5 74 43
                  L 74 47
                  C 74 48.5 73 50 71.5 50.5
                  C 69 51 67.5 53.5 68.5 56
                  C 69 57.5 68.5 59 67.5 60
                  L 64.5 63
                  C 63.5 64 62 64.5 60.5 64
                  C 58 63 55.5 64.5 55 67
                  C 55 68.5 53.5 69.5 52 69.5
                  L 48 69.5
                  C 46.5 69.5 45 68.5 45 67
                  C 44.5 64.5 42 63 39.5 64
                  C 38 64.5 36.5 64 35.5 63
                  L 32.5 60
                  C 31.5 59 31 57.5 31.5 56
                  C 32.5 53.5 31 51 28.5 50.5
                  C 27 50 26 48.5 26 47
                  L 26 43
                  C 26 41.5 27 40 28.5 39.5
                  C 31 39 32.5 36.5 31.5 34
                  C 31 32.5 31.5 31 32.5 30
                  L 35.5 27
                  C 36.5 26 38 25.5 39.5 26
                  C 42 27 44.5 25.5 45 23
                  Z
                "
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.45"
                fill="none"
              />

              {/* Concentric Recessed Circle Ring */}
              <circle cx="50" cy="45" r="14" fill="#150d30" stroke="#9333ea" strokeWidth="1.2" strokeOpacity="0.6" />

              {/* Solid Center Frosted Hub */}
              <circle cx="50" cy="45" r="8" fill={`url(#${id}-frosted3D)`} stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" />
            </g>
          )}
        </g>

        {/* Outer Squircle Sharp Highlighting Rim */}
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          rx="23"
          ry="23"
          fill="none"
          stroke={`url(#${id}-rim)`}
          strokeWidth="1.8"
        />
      </svg>
    </div>
  );
};
