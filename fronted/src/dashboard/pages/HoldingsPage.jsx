import { useState } from 'react';

function BriefcaseIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 80 80" fill="none" stroke="#ccc" strokeWidth="1.5">
      <rect x="10" y="28" width="60" height="40" rx="4"/>
      <path d="M26 28V22a6 6 0 0112 0v6"/>
      <line x1="10" y1="48" x2="70" y2="48"/>
    </svg>
  );
}

export default function HoldingsPage() {
  const [activeTab, setActiveTab] = useState('Equity');
  const [filter, setFilter] = useState('All equity');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Alert */}
      <div className="kite-alert-banner">
        Our team is verifying your account opening application form. This takes up to 24 working hours. We will notify you once it's ready.
      </div>

      {/* Sub tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
        <div className="kite-subtabs">
          {['All', 'Equity', 'Mutual funds'].map(t => (
            <button key={t} className={`kite-subtab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="kite-holdings-toolbar">
        <span className="kite-holdings-title">Holdings</span>
        <select className="kite-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All equity</option>
          <option>NSE</option>
          <option>BSE</option>
        </select>
      </div>

      {/* Empty state */}
      <div className="kite-empty" style={{ flex: 1 }}>
        <div className="kite-empty-icon"><BriefcaseIcon /></div>
        <p>You don't have any stocks in your DEMAT yet. Get started<br />with absolutely free equity investments.</p>
        <button className="kite-btn-blue">Get started</button>
        <span className="kite-link-blue">
          <span className="kite-link-icon">⊙</span>
          Analytics
        </span>
      </div>
    </div>
  );
}
