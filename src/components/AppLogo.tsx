import React from 'react';

interface AppLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 40,
  className = '',
  showText = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="relative shrink-0 flex items-center justify-center filter drop-shadow-md hover:scale-105 transition-transform duration-200"
      >
        <svg
          viewBox="0 0 540 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain"
        >
          <defs>
            {/* Gradient for '4' */}
            <linearGradient id="logo-grad-four" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="35%" stopColor="#1e3a8a" />
              <stop offset="75%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            {/* Gradient for 'U' */}
            <linearGradient id="logo-grad-u" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4c1d95" />
              <stop offset="35%" stopColor="#7e22ce" />
              <stop offset="75%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            {/* Glow for Cap Bulb */}
            <filter id="logo-bulb-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Number 4 */}
          <path
            d="M172 170 L72 315 L172 315 Z M208 170 L208 315 L236 315 L236 376 L208 376 L208 440 L152 440 L152 376 L40 376 L40 310 L152 145 L208 145 Z"
            fill="url(#logo-grad-four)"
          />

          {/* Letter U */}
          <path
            d="M250 170 L306 170 L306 320 C306 362 336 388 375 388 C414 388 444 362 444 320 L444 205 L500 205 L500 320 C500 395 448 444 375 444 C302 444 250 395 250 320 Z"
            fill="url(#logo-grad-u)"
          />

          {/* Graduation Cap and Lightbulb on right branch of U */}
          <g transform="translate(472, 138) scale(0.96)">
            {/* Lightbulb outline & glow */}
            <path
              d="M0 -75 C-26 -75 -42 -55 -42 -30 C-42 -12 -30 2 -20 16 L-20 30 L20 30 L20 16 C30 2 42 -12 42 -30 C42 -55 26 -75 0 -75 Z"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Filament */}
            <path
              d="M-12 10 L-12 -22 C-12 -32 -6 -38 0 -38 C6 -38 12 -32 12 -22 L12 10"
              fill="none"
              stroke="#2563eb"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M-7 -10 L7 -10"
              stroke="#2563eb"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Screw base */}
            <path
              d="M-16 34 L16 34 M-13 42 L13 42 M-9 50 L9 50"
              stroke="#1e3a8a"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Graduation Cap */}
            <polygon
              points="0,35 72,58 0,81 -72,58"
              fill="#0f172a"
              fillOpacity="0.1"
              stroke="#1e3a8a"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            <path
              d="M-40 68 C-40 92 40 92 40 68"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M-36 78 C-36 100 36 100 36 78"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Tassel Button & String */}
            <circle cx="0" cy="58" r="4.5" fill="#1e3a8a" />
            <path
              d="M0 58 Q48 68 58 92"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <rect x="54" y="92" width="9" height="18" rx="3" fill="#1e3a8a" />
          </g>
        </svg>
      </div>
      {showText && (
        <span className="font-extrabold tracking-tight text-white font-sans">
          4U <span className="text-indigo-400 font-medium text-xs">Math</span>
        </span>
      )}
    </div>
  );
};
