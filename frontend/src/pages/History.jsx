import React, { useEffect, useState } from 'react';
import { getScans } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import RiskGauge from '../components/RiskGauge';
import { Search, Calendar, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

const History = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getScans(50);
      setScans(data);
    } catch (err) {
      console.error('Failed to load scan history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredScans = scans.filter((scan) => {
    const term = search.toLowerCase();
    return (
      scan.input.toLowerCase().includes(term) ||
      scan.prediction.toLowerCase().includes(term) ||
      scan.risk_level.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Scan History</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review previously analyzed messages, URLs, and risk reports.</p>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            className="text-input"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>Loading scan history...</div>
      ) : filteredScans.length > 0 ? (
        <div className="card">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Scan Type</th>
                <th>Input Preview</th>
                <th>Risk Score</th>
                <th>Classification</th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.map((scan) => (
                <tr key={scan.id} onClick={() => setSelectedScan(scan)}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(scan.created_at).toLocaleString()}
                  </td>
                  <td style={{ textTransform: 'capitalize', fontWeight: '600' }}>{scan.scan_type}</td>
                  <td className="input-preview">{scan.input}</td>
                  <td>
                    <strong style={{ fontSize: '1.05rem' }}>{scan.risk_score}</strong> / 100
                  </td>
                  <td>
                    <RiskBadge prediction={scan.prediction} riskLevel={scan.risk_level} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FileText size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>No Scans Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Try analyzing a message on the Analyze page first.</p>
        </div>
      )}

      {/* Modal Detail View */}
      {selectedScan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="card" style={{ maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button
              onClick={() => setSelectedScan(null)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <RiskBadge prediction={selectedScan.prediction} riskLevel={selectedScan.risk_level} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {new Date(selectedScan.created_at).toLocaleString()}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Original Input:</div>
              <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                {selectedScan.input}
              </div>
            </div>

            <div className="result-grid">
              <RiskGauge score={selectedScan.risk_score} confidence={selectedScan.confidence} />

              <div className="analysis-details">
                <div>
                  <div className="reasons-title">
                    <AlertCircle size={18} color="var(--primary)" /> Detected Warning Indicators
                  </div>
                  <ul className="reasons-list">
                    {selectedScan.reasons.map((r, idx) => (
                      <li key={idx} className="reason-item">
                        <div className="reason-bullet" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="rec-title">
                    <CheckCircle size={18} color="var(--safe-gauge)" /> Recommended Action
                  </div>
                  <div className="recommendation-box">
                    {selectedScan.recommendation}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
