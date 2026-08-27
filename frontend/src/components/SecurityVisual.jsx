import React from 'react';

const SecurityVisual = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="340" height="340" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft Pink Background Aura */}
        <circle cx="170" cy="170" r="140" fill="#FDF2F8" />
        <circle cx="170" cy="170" r="110" fill="#FCE7F3" opacity="0.7" />
        
        {/* Cute Rose Shield */}
        <path
          d="M170 60L250 95V170C250 225 170 270 170 270C170 270 90 225 90 170V95L170 60Z"
          fill="#FFFFFF"
          stroke="#EC4899"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        
        {/* Heart-accented Security Lock */}
        <rect x="140" y="150" width="60" height="50" rx="10" fill="url(#pink_gradient)" />
        <path
          d="M150 150V135C150 123.954 158.954 115 170 115C181.046 115 190 123.954 190 135V150"
          stroke="#EC4899"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="170" cy="175" r="5" fill="#FFFFFF" />

        {/* Verification Check Badge */}
        <circle cx="230" cy="220" r="26" fill="#10B981" />
        <path
          d="M218 220L226 228L242 212"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Linear Gradient Definition */}
        <defs>
          <linearGradient id="pink_gradient" x1="140" y1="150" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F472B6" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default SecurityVisual;
