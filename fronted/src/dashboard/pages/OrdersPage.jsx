import { useState } from 'react';

const ORDER_TABS = ['Orders', 'GTT', 'Baskets', 'SIP', 'Alerts'];

// Notebook icon for empty state
function NotebookIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 80 80" fill="none" stroke="#ccc" strokeWidth="1.5">
      <rect x="18" y="10" width="46" height="58" rx="3"/>
      <rect x="14" y="14" width="8" height="50" rx="2" fill="#f0f0f0" stroke="#ccc"/>
      <line x1="30" y1="28" x2="54" y2="28"/>
      <line x1="30" y1="36" x2="54" y2="36"/>
      <line x1="30" y1="44" x2="48" y2="44"/>
      <line x1="18" y1="25" x2="22" y2="25"/>
      <line x1="18" y1="35" x2="22" y2="35"/>
      <line x1="18" y1="45" x2="22" y2="45"/>
      <line x1="18" y1="55" x2="22" y2="55"/>
    </svg>
  );
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('Orders');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sub tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
        <div className="kite-subtabs">
          {ORDER_TABS.map(t => (
            <button key={t} className={`kite-subtab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Alert */}
      <div className="kite-alert-banner">
        Our team is verifying your account opening application form. This takes up to 24 working hours. We will notify you once it's ready.
      </div>

      {/* Empty state */}
      <div className="kite-empty" style={{ flex: 1 }}>
        <div className="kite-empty-icon"><NotebookIcon /></div>
        <p>You haven't placed any orders today</p>
        <button className="kite-btn-blue">Get started</button>
        <span className="kite-link-blue">
          <span className="kite-link-icon">⊙</span>
          View history
        </span>
      </div>
    </div>
  );
}
