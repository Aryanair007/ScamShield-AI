import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

const RiskBadge = ({ prediction, riskLevel }) => {
  const p = (prediction || '').toUpperCase();

  if (p === 'SAFE') {
    return (
      <span className="risk-badge safe">
        <ShieldCheck size={16} />
        {riskLevel || 'SAFE'}
      </span>
    );
  } else if (p === 'SUSPICIOUS') {
    return (
      <span className="risk-badge suspicious">
        <AlertTriangle size={16} />
        {riskLevel || 'SUSPICIOUS'}
      </span>
    );
  } else {
    return (
      <span className="risk-badge scam">
        <ShieldAlert size={16} />
        {riskLevel || 'HIGH RISK'}
      </span>
    );
  }
};

export default RiskBadge;
