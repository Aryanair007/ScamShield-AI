import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: '600' }}>
          <ShieldCheck size={18} color="var(--primary)" />
          ScamShield AI — Digital Second Opinion
        </div>
        <p style={{ maxWidth: '600px', fontSize: '0.85rem' }}>
          Built with React, FastAPI, scikit-learn & MongoDB. Designed for practical scam and phishing detection.
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Disclaimer: ScamShield AI provides an automated risk assessment and is not a guaranteed determination of fraud.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
