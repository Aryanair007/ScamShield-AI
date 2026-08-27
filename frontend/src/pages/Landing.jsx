import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldAlert, Cpu, BarChart3, ArrowRight } from 'lucide-react';
import SecurityVisual from '../components/SecurityVisual';

const Landing = () => {
  return (
    <div>
      <section className="hero-section">
        <div>
          <div className="hero-tagline">Know before you click.</div>
          <h1 className="hero-title">SCAMSHIELD AI</h1>
          <p className="hero-description">
            AI-powered protection against suspicious messages and phishing attempts.
            Paste suspicious SMS, WhatsApp, Email, or URLs to receive real-time risk scores and actionable explanations.
          </p>
          <div className="hero-actions">
            <Link to="/analyze" className="btn btn-primary">
              Analyze a Message <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-secondary">
              See How It Works
            </Link>
          </div>
        </div>
        <div>
          <SecurityVisual />
        </div>
      </section>

      <section style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '2.5rem' }}>
          Comprehensive Digital Security Inspection
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Cpu size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Machine Learning NLP</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              TF-IDF vectorization and Logistic Regression trained on thousands of scam, phishing, and safe message patterns.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '40px', height: '40px', background: '#FEF3C7', color: '#D97706', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldAlert size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Security Rule Engine</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Detects urgency, prize/reward claims, fake KYC threats, OTP requests, and credential harvesting signals.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '40px', height: '40px', background: '#ECFDF5', color: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Search size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>URL Risk Inspector</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Analyzes hostname IP usage, non-standard TLDs, HTTPS encryption status, and subdomain obfuscation without visiting links.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '40px', height: '40px', background: '#EEF2FF', color: '#4338CA', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <BarChart3 size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Transparent 0–100 Scoring</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Provides clear SAFE / SUSPICIOUS / SCAM classifications with confidence percentages and practical safety recommendations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
