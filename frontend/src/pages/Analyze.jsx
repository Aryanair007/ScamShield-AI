import React, { useState } from 'react';
import { Search, Link as LinkIcon, Trash2, ShieldCheck, AlertCircle, Upload, CheckCircle } from 'lucide-react';
import { analyzeMessage, analyzeUrl, analyzeImage } from '../services/api';
import SampleLoader from '../components/SampleLoader';
import RiskBadge from '../components/RiskBadge';
import RiskGauge from '../components/RiskGauge';

const Analyze = () => {
  const [activeTab, setActiveTab] = useState('message'); // 'message' | 'url' | 'image'
  const [messageText, setMessageText] = useState('');
  const [urlText, setUrlText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await analyzeMessage(messageText);
      setResult(data);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to complete message analysis. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlText.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await analyzeUrl(urlText);
      setResult(data);
    } catch (err) {
      console.error('URL Analysis failed:', err);
      setError('Failed to complete URL analysis. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', selectedFile);
      const data = await analyzeImage(formData);
      setResult(data);
    } catch (err) {
      console.error('Image analysis failed:', err);
      setError('Failed to analyze image file. Try again or paste text manually.');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setMessageText('');
    setUrlText('');
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Is this message safe?</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Paste a suspicious message or enter a URL below to analyze warning signs with ScamShield AI.
        </p>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'message' ? 'active' : ''}`}
            onClick={() => setActiveTab('message')}
          >
            Message Analysis
          </button>
          <button
            className={`tab-btn ${activeTab === 'url' ? 'active' : ''}`}
            onClick={() => setActiveTab('url')}
          >
            URL Analysis
          </button>
          <button
            className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => setActiveTab('image')}
          >
            Screenshot Analysis (OCR)
          </button>
        </div>

        {activeTab === 'message' && (
          <form onSubmit={handleMessageSubmit}>
            <textarea
              className="textarea-input"
              placeholder="Paste your suspicious SMS, WhatsApp message, email, or text here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'space-between' }}>
              <SampleLoader onSelectSample={(sample) => setMessageText(sample)} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              {messageText && (
                <button type="button" className="btn btn-secondary" onClick={clearAll}>
                  <Trash2 size={16} /> Clear
                </button>
              )}
              <button type="submit" className="btn btn-primary" disabled={loading || !messageText.trim()}>
                {loading ? 'Analyzing...' : 'Analyze Message'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="text-input"
                placeholder="Enter suspicious URL (e.g. http://hdfc-bank-verify-kyc.net)..."
                value={urlText}
                onChange={(e) => setUrlText(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              {urlText && (
                <button type="button" className="btn btn-secondary" onClick={clearAll}>
                  <Trash2 size={16} /> Clear
                </button>
              )}
              <button type="submit" className="btn btn-primary" disabled={loading || !urlText.trim()}>
                {loading ? 'Analyzing URL...' : 'Analyze URL'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'image' && (
          <form onSubmit={handleImageSubmit}>
            <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2.5rem', textAlign: 'center', background: 'var(--bg-subtle)' }}>
              <Upload size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Upload Screenshot for OCR Text Extraction</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem' }}>
                Select an image file (.png, .jpg) containing a suspicious message.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ display: 'inline-block' }}
              />
              {selectedFile && (
                <div style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                  Selected: {selectedFile.name}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={loading || !selectedFile}>
                {loading ? 'Processing OCR & Analyzing...' : 'Analyze Screenshot'}
              </button>
            </div>
          </form>
        )}
      </div>

      {error && (
        <div style={{ maxWidth: '800px', margin: '1.5rem auto 0', padding: '1rem', background: 'var(--scam-bg)', border: '1px solid var(--scam-border)', borderRadius: 'var(--radius-md)', color: 'var(--scam-text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {result && (
        <div className="result-card" style={{ maxWidth: '800px', margin: '2rem auto 0' }}>
          <div className="result-header">
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Analysis Result
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '0.2rem' }}>
                {result.prediction === 'SAFE' && 'Message Appears Safe'}
                {result.prediction === 'SUSPICIOUS' && 'Suspicious Content Flagged'}
                {result.prediction === 'SCAM' && 'High Risk Scam Detected'}
              </h2>
            </div>
            <RiskBadge prediction={result.prediction} riskLevel={result.risk_level} />
          </div>

          <div className="result-grid">
            <RiskGauge score={result.risk_score} confidence={result.confidence} />

            <div className="analysis-details">
              <div>
                <div className="reasons-title">
                  <AlertCircle size={18} color="var(--primary)" /> Why We Flagged It
                </div>
                {result.reasons && result.reasons.length > 0 ? (
                  <ul className="reasons-list">
                    {result.reasons.map((reason, idx) => (
                      <li key={idx} className="reason-item">
                        <div className="reason-bullet" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>No significant risk indicators identified.</p>
                )}
              </div>

              <div>
                <div className="rec-title">
                  <CheckCircle size={18} color="var(--safe-gauge)" /> Recommended Action
                </div>
                <div className="recommendation-box">
                  {result.recommendation}
                </div>
              </div>
            </div>
          </div>

          <div className="disclaimer-box">
            Notice: ScamShield AI uses statistical machine learning and security heuristics for risk estimation. It is not an absolute guarantee of fraud.
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;
