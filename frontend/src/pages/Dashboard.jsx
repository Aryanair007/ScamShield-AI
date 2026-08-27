import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ShieldAlert, Activity, ArrowUpRight } from 'lucide-react';
import { getDashboardStats } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setError('Unable to connect to ScamShield backend API.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem 0', textAlign: 'center' }}>Loading live dashboard metrics...</div>;
  }

  if (error) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', margin: '2rem 0' }}>
        <ShieldAlert size={40} color="var(--scam-gauge)" style={{ marginBottom: '1rem' }} />
        <h3>API Connection Notice</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={fetchStats}>Retry Connection</button>
      </div>
    );
  }

  const { total_scans, scam_detections, suspicious_detections, safe_detections, recent_scans } = stats || {};

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Security Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Overview of real-time scam detection analytics and scan history.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="stat-val">{total_scans || 0}</div>
            <div className="stat-lbl">Total Scans</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--scam-bg)', color: 'var(--scam-text)' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: 'var(--scam-text)' }}>{scam_detections || 0}</div>
            <div className="stat-lbl">Scams Flagged</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--suspicious-bg)', color: 'var(--suspicious-text)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: 'var(--suspicious-text)' }}>{suspicious_detections || 0}</div>
            <div className="stat-lbl">Suspicious Scans</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--safe-bg)', color: 'var(--safe-text)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: 'var(--safe-text)' }}>{safe_detections || 0}</div>
            <div className="stat-lbl">Safe Messages</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recent Security Scans</h2>
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }} onClick={() => navigate('/history')}>
            View All Scans <ArrowUpRight size={16} />
          </button>
        </div>

        {recent_scans && recent_scans.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Content Preview</th>
                <th>Risk Score</th>
                <th>Classification</th>
              </tr>
            </thead>
            <tbody>
              {recent_scans.map((scan) => (
                <tr key={scan.id} onClick={() => navigate(`/history`)}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(scan.created_at).toLocaleString()}
                  </td>
                  <td style={{ textTransform: 'capitalize', fontWeight: '600' }}>{scan.scan_type}</td>
                  <td className="input-preview">{scan.input}</td>
                  <td>
                    <strong style={{ fontSize: '1rem' }}>{scan.risk_score}</strong> / 100
                  </td>
                  <td>
                    <RiskBadge prediction={scan.prediction} riskLevel={scan.risk_level} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No recent security scans found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
