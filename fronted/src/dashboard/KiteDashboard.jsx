import { useState, useEffect } from 'react';
import './KiteDashboard.css';
import DashboardHome from './pages/DashboardHome';
import OrdersPage from './pages/OrdersPage';
import HoldingsPage from './pages/HoldingsPage';
import PositionsPage from './pages/PositionsPage';
import FundsPage from './pages/FundsPage';

// Watchlist data
const watchlistStocks = [
  { name: 'HDFCBANK', tags: ['BSE'], change: 6.55, pct: 0.80, price: 824.25, up: true },
  { name: 'INFY', tags: [], change: 17.20, pct: 1.64, price: 1068.00, up: true },
  { name: 'TCS', tags: ['BSE', 'EVENT'], change: 21.30, pct: 1.04, price: 2069.05, up: true },
  { name: 'ONGC', tags: [], change: 1.31, pct: 0.54, price: 244.96, up: true },
  { name: 'HINDUNILVR', tags: ['BSE'], change: 5.20, pct: 0.24, price: 2149.30, up: true },
  { name: 'GOLDBEES', tags: [], change: -0.28, pct: -0.24, price: 118.14, up: false },
];

const NAV_PAGES = ['Dashboard', 'Orders', 'Holdings', 'Positions', 'Bids', 'Funds'];

export default function KiteDashboard() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [hoveredStock, setHoveredStock] = useState(null);

  // Cancel the global body padding-top from LandingPage.css
  useEffect(() => {
    document.body.classList.add('no-nav-padding');
    return () => document.body.classList.remove('no-nav-padding');
  }, []);

  function renderPage() {
    switch (activePage) {
      case 'Dashboard': return <DashboardHome />;
      case 'Orders':    return <OrdersPage />;
      case 'Holdings':  return <HoldingsPage />;
      case 'Positions': return <PositionsPage />;
      case 'Bids':      return <PositionsPage emptyMsg="You don't have any bids yet" icon="bids" />;
      case 'Funds':     return <FundsPage />;
      default:          return <DashboardHome />;
    }
  }

  return (
    <div className="kite-root">
      {/* ── TICKER BAR ─────────────────────────────── */}
      <div className="kite-ticker-bar">
        <span className="ticker-item">
          <span className="ticker-label">NIFTY 50</span>
          <span className="ticker-price green">24,206.90</span>
          <span className="ticker-change green">244.10 (1.02%)</span>
        </span>
        <span className="ticker-sep" />
        <span className="ticker-item">
          <span className="ticker-label">SENSEX</span>
          <span className="ticker-price green">77,569.39</span>
          <span className="ticker-change green">827.57 (1.08%)</span>
        </span>
      </div>

      {/* ── TOP NAVBAR ──────────────────────────────── */}
      <header className="kite-topbar">
        <div className="kite-topbar-left">
          {/* Kite Logo */}
          <div className="kite-logo">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <polygon points="20,2 38,32 2,32" fill="#e84040" />
              <polygon points="20,10 30,28 10,28" fill="#fff" opacity="0.3"/>
            </svg>
          </div>
          {/* Watchlist selector */}
          <div className="kite-watchlist-selector">
            <span>Default</span>
            <span className="kite-new-badge">NEW</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <button className="kite-grid-btn" title="Manage watchlists">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </button>
        </div>

        <nav className="kite-topbar-nav">
          {NAV_PAGES.map(page => (
            <button
              key={page}
              className={`kite-nav-btn${activePage === page ? ' active' : ''}`}
              onClick={() => setActivePage(page)}
            >
              {page}
            </button>
          ))}
        </nav>

        <div className="kite-topbar-right">
          {/* Cart icon */}
          <button className="kite-icon-btn" title="Basket orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
          {/* Bell */}
          <button className="kite-icon-btn" title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
          {/* Avatar */}
          <div className="kite-avatar" title="Profile">K</div>
          <span className="kite-user-id">BZD094</span>
        </div>
      </header>

      <div className="kite-body">
        {/* ── LEFT SIDEBAR ────────────────────────────── */}
        <aside className="kite-sidebar">
          {/* Search */}
          <div className="kite-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search eg: infy bse, nifty fut, index fund, et" />
            <span className="kite-search-shortcut">Ctrl+K</span>
            <button className="kite-filter-btn" title="Filters">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Watchlist header */}
          <div className="kite-watchlist-header">
            <span className="kite-watchlist-title">Watchlist 1 <span className="kite-wl-count">(6 / 250)</span></span>
            <button className="kite-new-group-btn">+ New group</button>
          </div>

          {/* Group label */}
          <div className="kite-group-label">Default (6)</div>

          {/* Stock list */}
          <div className="kite-stock-list">
            {watchlistStocks.map((stock, i) => (
              <div
                key={stock.name}
                className={`kite-stock-row${hoveredStock === i ? ' hovered' : ''}`}
                onMouseEnter={() => setHoveredStock(i)}
                onMouseLeave={() => setHoveredStock(null)}
              >
                <div className="kite-stock-left">
                  <span className={`kite-stock-name${stock.up ? ' green' : ' red'}`}>{stock.name}</span>
                  <span className="kite-stock-tags">
                    {stock.tags.map(t => (
                      <span key={t} className={`kite-tag kite-tag-${t.toLowerCase()}`}>{t}</span>
                    ))}
                  </span>
                </div>
                <div className="kite-stock-right">
                  <span className={`kite-stock-change ${stock.up ? 'green' : 'red'}`}>
                    {stock.change > 0 ? '' : ''}{stock.change.toFixed(2)}
                  </span>
                  <span className={`kite-stock-pct ${stock.up ? 'green' : 'red'}`}>
                    {stock.up ? '↑' : '↓'} {Math.abs(stock.pct).toFixed(2)}%
                  </span>
                  <span className={`kite-stock-price ${stock.up ? 'green' : 'red'}`}>
                    {stock.price.toFixed(2)}
                  </span>
                </div>
                {/* Hover action buttons */}
                {hoveredStock === i && (
                  <div className="kite-stock-actions">
                    <button className="kite-action-buy">B</button>
                    <button className="kite-action-sell">S</button>
                    <button className="kite-action-more">⋯</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom: Page tabs */}
          <div className="kite-sidebar-footer">
            <div className="kite-page-tabs">
              {[1,2,3,4,5,6,7].map(n => (
                <button key={n} className={`kite-page-tab${n === 1 ? ' active' : ''}`}>{n}</button>
              ))}
            </div>
            <button className="kite-settings-btn" title="Manage watchlists">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            </button>
            <button className="kite-add-wl-btn" title="Add watchlist">+</button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ────────────────────────────── */}
        <main className="kite-main">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
