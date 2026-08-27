import React from 'react';

const RiskGauge = ({ score = 0, confidence = 90 }) => {
  const clampedScore = Math.min(100, Math.max(0, score));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  let color = 'var(--safe-gauge)';
  if (clampedScore >= 61) {
    color = 'var(--scam-gauge)';
  } else if (clampedScore >= 31) {
    color = 'var(--suspicious-gauge)';
  }

  return (
    <div className="score-panel">
      <div className="gauge-circle">
        <svg width="140" height="140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="var(--border-color)"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={color}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="gauge-text">
          <div className="gauge-number">{clampedScore}</div>
          <div className="gauge-denom">/ 100</div>
        </div>
      </div>
      <div className="confidence-text">
        Confidence: <strong>{confidence}%</strong>
      </div>
    </div>
  );
};

export default RiskGauge;
