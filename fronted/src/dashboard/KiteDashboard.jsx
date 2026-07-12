import { useState, useEffect, useRef, useCallback } from 'react';
import './KiteDashboard.css';
import DashboardHome from './pages/DashboardHome';
import OrdersPage from './pages/OrdersPage';
import HoldingsPage from './pages/HoldingsPage';
import PositionsPage from './pages/PositionsPage';
import FundsPage from './pages/FundsPage';
import ChartsPage from './pages/ChartsPage';

const BACKEND_URL = 'http://localhost:8080';
const POLL_INTERVAL_MS = 3000; // refresh every 3 seconds

// Watchlist config — maps display name to Kite instrument string
const WATCHLIST_CONFIG = [
  { name: 'HDFCBANK',   instrument: 'NSE:HDFCBANK',   exchange: 'NSE', tags: ['BSE'] },
  { name: 'INFY',       instrument: 'NSE:INFY',        exchange: 'NSE', tags: []      },
  { name: 'TCS',        instrument: 'NSE:TCS',         exchange: 'NSE', tags: ['BSE', 'EVENT'] },
  { name: 'ONGC',       instrument: 'NSE:ONGC',        exchange: 'NSE', tags: []      },
  { name: 'HINDUNILVR', instrument: 'NSE:HINDUNILVR',  exchange: 'NSE', tags: ['BSE'] },
  { name: 'GOLDBEES',   instrument: 'NSE:GOLDBEES',    exchange: 'NSE', tags: []      },
];

const TICKER_INSTRUMENTS = 'NSE:NIFTY 50,NSE:HDFCBANK,NSE:INFY,NSE:TCS,NSE:ONGC,NSE:HINDUNILVR,NSE:GOLDBEES';
const WATCHLIST_INSTRUMENTS = WATCHLIST_CONFIG.map(s => s.instrument).join(',');

const NAV_PAGES = ['Dashboard', 'Charts', 'Orders', 'Holdings', 'Positions', 'Bids', 'Funds'];

// ── Price Flash Hook ──────────────────────────────────────────────────────────
// Tracks prev price to show green/red flash on change
function usePriceFlash(price) {
  const prevRef = useRef(price);
  const [flash, setFlash] = useState(null); // 'up' | 'down' | null

  useEffect(() => {
    if (prevRef.current === undefined || price === undefined) return;
    if (price > prevRef.current) setFlash('up');
    else if (price < prevRef.current) setFlash('down');
    prevRef.current = price;
    const t = setTimeout(() => setFlash(null), 500);
    return () => clearTimeout(t);
  }, [price]);

  return flash;
}

// ── Single stock row ──────────────────────────────────────────────────────────
function StockRow({ stock, quote, isHovered, onMouseEnter, onMouseLeave, onOpenChart }) {
  const lastPrice = quote?.lastPrice;
  const change    = quote?.change;
  const pct       = quote?.changePct;
  const up        = (change ?? 0) >= 0;
  const flash     = usePriceFlash(lastPrice);

  return (
    <div
      className={`kite-stock-row${isHovered ? ' hovered' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="kite-stock-left">
        <span className={`kite-stock-name ${up ? 'green' : 'red'}`}>{stock.name}</span>
        <span className="kite-stock-tags">
          {stock.tags.map(t => (
            <span key={t} className={`kite-tag kite-tag-${t.toLowerCase()}`}>{t}</span>
          ))}
        </span>
      </div>

      <div className="kite-stock-right">
        {quote ? (
          <>
            <span className={`kite-stock-change ${up ? 'green' : 'red'}`}>
              {change >= 0 ? '+' : ''}{(change ?? 0).toFixed(2)}
            </span>
            <span className={`kite-stock-pct ${up ? 'green' : 'red'}`}>
              {up ? '↑' : '↓'} {Math.abs(pct ?? 0).toFixed(2)}%
            </span>
            <span className={`kite-stock-price ${up ? 'green' : 'red'} price-flash-${flash ?? 'none'}`}>
              {(lastPrice ?? 0).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="kite-stock-price loading-shimmer">—</span>
        )}
      </div>

      {isHovered && (
        <div className="kite-stock-actions">
          <button className="kite-action-buy">B</button>
          <button className="kite-action-sell">S</button>
          <button
            className="kite-action-chart"
            title="View Chart"
            onClick={e => { e.stopPropagation(); onOpenChart(stock.name); }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </button>
          <button className="kite-action-more">⋯</button>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function KiteDashboard() {
  const [activePage, setActivePage]   = useState('Dashboard');
  const [hoveredStock, setHoveredStock] = useState(null);
  const [chartSymbol, setChartSymbol] = useState(null);
  const [quotes, setQuotes]           = useState({});
  const [tickerQuotes, setTickerQuotes] = useState({});
  const [liveStatus, setLiveStatus]   = useState('connecting'); // 'connecting' | 'live' | 'demo' | 'error'

  function openChart(stockName) {
    setChartSymbol(stockName);
    setActivePage('Charts');
  }

  // Cancel the global body padding-top from LandingPage.css
  useEffect(() => {
    document.body.classList.add('no-nav-padding');
    return () => document.body.classList.remove('no-nav-padding');
  }, []);

  // ── Live price polling ──────────────────────────────────────────────────────
  const fetchQuotes = useCallback(async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/quotes?instruments=${encodeURIComponent(TICKER_INSTRUMENTS)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && typeof data === 'object' && !data.error) {
        setQuotes(data);
        setTickerQuotes(data);
        // Check if data looks like demo (no real last traded time info — just mark as demo if backend says so)
        setLiveStatus('live');
      } else {
        setLiveStatus('error');
      }
    } catch {
      setLiveStatus('error');
    }
  }, []);

  useEffect(() => {
    // Check auth status to show demo/live indicator
    fetch(`${BACKEND_URL}/api/auth/status`)
      .then(r => r.json())
      .then(s => setLiveStatus(s.demoMode ? 'demo' : 'live'))
      .catch(() => setLiveStatus('demo'));

    fetchQuotes();
    const interval = setInterval(fetchQuotes, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchQuotes]);

  // Derived ticker values
  const nifty   = tickerQuotes['NSE:NIFTY 50'];
  const sensex  = tickerQuotes['BSE:SENSEX'];

  function renderPage() {
    switch (activePage) {
      case 'Dashboard': return <DashboardHome onOpenChart={openChart} />;
      case 'Charts':    return <ChartsPage initialSymbol={chartSymbol} />;
      case 'Orders':    return <OrdersPage />;
      case 'Holdings':  return <HoldingsPage />;
      case 'Positions': return <PositionsPage />;
      case 'Bids':      return <PositionsPage emptyMsg="You don't have any bids yet" icon="bids" />;
      case 'Funds':     return <FundsPage />;
      default:          return <DashboardHome onOpenChart={openChart} />;
    }
  }

  return (
    <div className="kite-root">
      {/* ── TICKER BAR ─────────────────────────────── */}
      <div className="kite-ticker-bar">
        {/* NIFTY 50 live */}
        <span className="ticker-item">
          <span className="ticker-label">NIFTY 50</span>
          {nifty ? (
            <>
              <span className={`ticker-price ${nifty.changePct >= 0 ? 'green' : 'red'}`}>
                {nifty.lastPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`ticker-change ${nifty.changePct >= 0 ? 'green' : 'red'}`}>
                {nifty.change >= 0 ? '+' : ''}{nifty.change.toFixed(2)} ({Math.abs(nifty.changePct).toFixed(2)}%)
              </span>
            </>
          ) : (
            <span className="ticker-price" style={{ color: '#999' }}>Loading…</span>
          )}
        </span>

        <span className="ticker-sep" />

        {/* SENSEX static (BSE index not in free plan, shown as reference) */}
        <span className="ticker-item">
          <span className="ticker-label">SENSEX</span>
          <span className="ticker-price green">77,569.39</span>
          <span className="ticker-change green">827.57 (1.08%)</span>
        </span>

        <span className="ticker-sep" />

        {/* Live / Demo badge */}
        <span className={`ticker-live-badge ${liveStatus}`}>
          <span className="ticker-live-dot" />
          {liveStatus === 'live' ? 'LIVE' : liveStatus === 'demo' ? 'DEMO' : liveStatus === 'connecting' ? '…' : 'ERR'}
        </span>
      </div>

      {/* ── TOP NAVBAR ──────────────────────────────── */}
      <header className="kite-topbar">
        <div className="kite-topbar-left">
          <div className="kite-logo">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <polygon points="20,2 38,32 2,32" fill="#e84040" />
              <polygon points="20,10 30,28 10,28" fill="#fff" opacity="0.3"/>
            </svg>
          </div>
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
          <button className="kite-icon-btn" title="Basket orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
          <button className="kite-icon-btn" title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
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
            <input type="text" placeholder="Search eg: infy bse, nifty fut…" />
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
            <span className="kite-watchlist-title">
              Watchlist 1 <span className="kite-wl-count">(6 / 250)</span>
            </span>
            <button className="kite-new-group-btn">+ New group</button>
          </div>

          <div className="kite-group-label">Default (6)</div>

          {/* Stock list — live prices */}
          <div className="kite-stock-list">
            {WATCHLIST_CONFIG.map((stock, i) => (
              <StockRow
                key={stock.name}
                stock={stock}
                quote={quotes[stock.instrument]}
                isHovered={hoveredStock === i}
                onMouseEnter={() => setHoveredStock(i)}
                onMouseLeave={() => setHoveredStock(null)}
                onOpenChart={openChart}
              />
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
