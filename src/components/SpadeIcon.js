import React from 'react';

export default function SpadeIcon({ size = 32, glow = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glow ? {
        filter: 'drop-shadow(0 0 8px rgba(255,107,26,0.8)) drop-shadow(0 0 20px rgba(255,69,0,0.5))'
      } : {}}
    >
      <defs>
        <linearGradient id="spadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffaa00" />
          <stop offset="50%" stopColor="#ff6b1a" />
          <stop offset="100%" stopColor="#ff4500" />
        </linearGradient>
      </defs>
      {/* Spade shape */}
      <path
        d="M50 5 C50 5 10 35 10 58 C10 72 20 80 32 78 C28 88 22 95 15 98 L85 98 C78 95 72 88 68 78 C80 80 90 72 90 58 C90 35 50 5 50 5Z"
        fill="url(#spadeGrad)"
      />
      {/* Stem */}
      <rect x="44" y="85" width="12" height="13" rx="2" fill="url(#spadeGrad)" />
    </svg>
  );
}
