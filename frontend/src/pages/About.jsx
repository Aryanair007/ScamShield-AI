import React from 'react';
import { ShieldCheck, Cpu, Code2, Database, Lock, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>About ScamShield AI</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem' }}>
          An AI-powered scam and phishing detection system engineered for technical transparency and consumer digital defense.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck color="var(--primary)" /> Project Mission & Motivation
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          Digital fraud across SMS, WhatsApp, and email platforms continues to rise, targeting unsuspecting users with urgency, fake rewards, and credential-harvesting phishing links. ScamShield AI acts as a <strong>digital second opinion</strong>, helping users inspect suspicious messages before they click links or share sensitive information.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '1.5rem' }}>Technical Architecture</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Code2 size={18} /> Frontend Stack
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Built with React, Vite, JavaScript, CSS, Axios, and React Router DOM following clean, light neutral fintech design principles.
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={18} /> Backend API
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Python FastAPI server with Uvicorn, Pydantic validation, modular route handling, and RESTful JSON endpoints.
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={18} /> Machine Learning Engine
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              TF-IDF (1-2 ngrams) vectorization + Logistic Regression trained on scam & authentic datasets, serialized via joblib.
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Database size={18} /> Database Persistence
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              MongoDB Atlas cloud integration via PyMongo, featuring an offline in-memory repository fallback for reliable live demonstrations.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '1rem' }}>Risk Scoring Formula (0–100)</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          ScamShield AI combines Machine Learning probability, heuristic rule evaluations, and URL risk signals into a single score:
        </p>

        <div style={{ background: 'var(--primary-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--primary-hover)', marginBottom: '1.5rem' }}>
          Risk Score = (ML Probability × 45%) + (Rule Engine Score × 40%) + (URL Risk Score × 15%)
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <CheckCircle2 size={18} color="var(--safe-gauge)" /> <strong>0 – 30 LOW RISK (SAFE)</strong>: Standard message tone without alarming signals.
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <CheckCircle2 size={18} color="var(--suspicious-gauge)" /> <strong>31 – 60 SUSPICIOUS (MEDIUM RISK)</strong>: Minor warning signs or unverified links present.
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <CheckCircle2 size={18} color="var(--scam-gauge)" /> <strong>61 – 100 HIGH RISK (SCAM)</strong>: Severe urgency, fake bank warnings, prize claims, or credential requests.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
