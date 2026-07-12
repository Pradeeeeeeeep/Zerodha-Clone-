import { useState, useEffect } from 'react';

const topGainers = [
  { name: 'GODREJIND', exch: 'NSE', price: '1417.70', pct: '16.28%' },
  { name: 'J&KBANK',   exch: 'NSE', price: '192.65',  pct: '14.39%' },
  { name: 'ZENSARTECH',exch: 'NSE', price: '508.25',  pct: '13.60%' },
  { name: 'INDIANB',   exch: 'NSE', price: '870.70',  pct: '9.78%'  },
  { name: 'NEWGEN',    exch: 'NSE', price: '517.20',  pct: '9.30%'  },
  { name: 'BLUEJET',   exch: 'NSE', price: '624.05',  pct: '8.62%'  },
  { name: 'MRPL',      exch: 'NSE', price: '162.49',  pct: '8.56%'  },
  { name: 'BRIGADE',   exch: 'NSE', price: '574.60',  pct: '7.60%'  },
];

const topLosers = [
  { name: 'SCHNEIDER',  exch: 'NSE', price: '1414.20',  pct: '-4.78%' },
  { name: 'PAGEIND',    exch: 'NSE', price: '39395.00', pct: '-3.00%' },
  { name: 'SWIGGY',     exch: 'NSE', price: '273.25',   pct: '-2.74%' },
  { name: 'KAYNES',     exch: 'NSE', price: '3336.10',  pct: '-2.71%' },
  { name: 'ZEEL',       exch: 'NSE', price: '97.47',    pct: '-2.32%' },
  { name: 'ELGIEQUIP',  exch: 'NSE', price: '576.35',   pct: '-2.10%' },
  { name: 'DRREDDY',    exch: 'NSE', price: '1244.30',  pct: '-1.99%' },
  { name: 'CAPLIPOINT', exch: 'NSE', price: '2583.60',  pct: '-1.44%' },
];

const liveIpos = [
  { name: 'Laser Power and Infra', ticker: 'LASERPOWER', dates: 'Thu 9 Jul - Mon 13 Jul', color: '#e8f0fd' },
  { name: 'Devson Catalyst',       ticker: 'DEVSON',     dates: 'Thu 9 Jul - Mon 13 Jul', color: '#fde8f0' },
  { name: 'Happy Steels',          ticker: 'HAPPY',      dates: 'Thu 9 Jul - Mon 13 Jul', color: '#e8fdf0' },
];
const upcomingIpos = [
  { name: 'SBI Funds Management',   ticker: 'SBIFUNDS', dates: 'Tue 14 Jul - Thu 16 Jul', color: '#e8f0fd' },
  { name: 'Alpine Texworld',        ticker: 'ALPINE',   dates: 'Tue 14 Jul - Thu 16 Jul', color: '#fdf5e8' },
  { name: 'Millworks Technologies', ticker: 'MILLTECH', dates: 'Tue 14 Jul - Thu 16 Jul', color: '#ede8fd' },
  { name: 'NSE',                    ticker: 'NSE',      dates: 'To be announced',          color: '#e8f0fd' },
  { name: 'Reliance Jio',           ticker: 'JIO',      dates: 'To be announced',          color: '#fdf0e8' },
  { name: 'Acko',                   ticker: 'ACKO',     dates: 'To be announced',          color: '#e8fdf0' },
  { name: 'OYO',                    ticker: 'OYO',      dates: 'To be announced',          color: '#fde8e8' },
];

// Dynamic sparkline from backend
function SparkLine({ candles = [], color = '#4184f3' }) {
  if (!candles || candles.length === 0) {
    // Fallback static sparkline while loading
    const staticPts = [60,58,62,64,60,55,52,56,58,54,50,48,52,56,54,58,60,55,52,56,58,60,62];
    const w = 600; const h = 80;
    const min = Math.min(...staticPts); const max = Math.max(...staticPts);
    const xStep = w / (staticPts.length - 1);
    const toY = v => h - ((v - min) / (max - min)) * h;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <polyline
          points={staticPts.map((p, i) => `${i * xStep},${toY(p)}`).join(' ')}
          fill="none" stroke={color} strokeWidth="2" opacity="0.5"
        />
      </svg>
    );
  }

  const closes = candles.map(c => c.close);
  const w = 600; const h = 80;
  const minP = Math.min(...closes); const maxP = Math.max(...closes);
  const range = maxP - minP || 1;
  const xStep = w / Math.max(1, closes.length - 1);
  const toY = v => h - ((v - minP) / range) * h;

  const linePoints = closes.map((p, i) => `${i * xStep},${toY(p)}`).join(' ');
  // Area fill path
  const areaPath = [
    `M0,${h}`,
    ...closes.map((p, i) => `L${i * xStep},${toY(p)}`),
    `L${(closes.length - 1) * xStep},${h}`,
    'Z'
  ].join(' ');

  const isUp = closes[closes.length - 1] >= closes[0];
  const lineColor = isUp ? '#28a745' : '#e84040';

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={lineColor} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkGrad)" />
      <polyline points={linePoints} fill="none" stroke={lineColor} strokeWidth="2" />
    </svg>
  );
}

export default function DashboardHome({ onOpenChart }) {
  const [ipoTab, setIpoTab] = useState('Upcoming IPOs');
  const [marketCandles, setMarketCandles] = useState([]);
  const [marketLoading, setMarketLoading] = useState(true);

  // Fetch NIFTY 50 daily candles from backend for Market Overview
  useEffect(() => {
    const from = new Date();
    from.setDate(from.getDate() - 180);
    const fromStr = from.toISOString().slice(0, 10);
    const toStr = new Date().toISOString().slice(0, 10);

    fetch(`http://localhost:8080/api/chart/historical?instrumentToken=256265&interval=day&from=${fromStr}&to=${toStr}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setMarketCandles(data);
      })
      .catch(() => { /* keep static fallback */ })
      .finally(() => setMarketLoading(false));
  }, []);

  return (
    <div className="kite-dash-page">
      {/* Sub tabs */}
      <div className="kite-dash-tabs kite-subtabs">
        <button className="kite-subtab active">Dashboard</button>
        <button className="kite-subtab">Screener</button>
      </div>

      {/* Alert */}
      <div className="kite-alert-banner">
        Our team is verifying your account opening application form. This takes up to 24 working hours. We will notify you once it's ready.
      </div>

      {/* Greeting */}
      <div className="kite-greeting">Hi, Pradip</div>

      {/* Margin cards */}
      <div className="kite-margin-row">
        {/* Equity */}
        <div className="kite-margin-card">
          <div className="kite-margin-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Equity
          </div>
          <div className="kite-margin-main">
            <div>
              <div className="kite-margin-big">0</div>
              <div className="kite-margin-label">Margin available</div>
            </div>
            <div className="kite-margin-details">
              <div className="kite-margin-row-item"><span>Margins used</span><span>0</span></div>
              <div className="kite-margin-row-item"><span>Opening balance</span><span>0</span></div>
              <div className="kite-margin-row-item"><a href="#">⊙ View statement</a></div>
            </div>
          </div>
        </div>

        {/* Commodity */}
        <div className="kite-margin-card">
          <div className="kite-margin-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 19 21 12 17 5 21 12 2"/>
            </svg>
            Commodity
          </div>
          <div className="kite-margin-main">
            <div>
              <div className="kite-margin-big">0</div>
              <div className="kite-margin-label">Margin available</div>
            </div>
            <div className="kite-margin-details">
              <div className="kite-margin-row-item"><span>Margins used</span><span>0</span></div>
              <div className="kite-margin-row-item"><span>Opening balance</span><span>0</span></div>
              <div className="kite-margin-row-item"><a href="#">⊙ View statement</a></div>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings empty */}
      <div className="kite-holdings-placeholder">
        <div style={{ color: '#bbb', marginBottom: 12 }}>
          <svg width="60" height="60" viewBox="0 0 80 80" fill="none" stroke="#ccc" strokeWidth="2">
            <rect x="10" y="20" width="60" height="45" rx="4"/>
            <path d="M25 20V15a15 15 0 0130 0v5"/>
            <line x1="30" y1="42" x2="50" y2="42"/>
            <line x1="30" y1="50" x2="45" y2="50"/>
          </svg>
        </div>
        <p style={{ color: '#999', fontSize: 13, marginBottom: 16 }}>
          You don't have any stocks in your DEMAT yet. Get started<br />with absolutely free equity investments.
        </p>
        <button className="kite-btn-blue">Start investing</button>
      </div>

      {/* Bottom market section */}
      <div className="kite-market-section">
        {/* Top Gainers */}
        <div className="kite-market-card">
          <div className="kite-market-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="kite-market-card-title">Top Gainers</span>
              <span className="kite-market-card-sub">Nifty 500</span>
            </div>
            <button className="kite-market-more-btn">⋯</button>
          </div>
          <div className="kite-gainers-table">
            {topGainers.map(s => (
              <div key={s.name} className="kite-gainer-row">
                <div style={{ flex: 1 }}>
                  <div className="kite-gainer-name">{s.name}</div>
                  <div className="kite-gainer-exch">{s.exch}</div>
                </div>
                <div className="kite-gainer-price green">{s.price}</div>
                <div className="kite-gainer-pct green">↑ {s.pct}</div>
              </div>
            ))}
          </div>
          <div className="kite-view-all-row">
            <a href="#" className="kite-view-all-link">View all →</a>
          </div>
        </div>

        {/* Top Losers */}
        <div className="kite-market-card">
          <div className="kite-market-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="kite-market-card-title">Top Losers</span>
              <span className="kite-market-card-sub">Nifty 500</span>
            </div>
            <button className="kite-market-more-btn">⋯</button>
          </div>
          <div className="kite-gainers-table">
            {topLosers.map(s => (
              <div key={s.name} className="kite-gainer-row">
                <div style={{ flex: 1 }}>
                  <div className="kite-gainer-name">{s.name}</div>
                  <div className="kite-gainer-exch">{s.exch}</div>
                </div>
                <div className="kite-gainer-price red">{s.price}</div>
                <div className="kite-gainer-pct red">↓ {s.pct}</div>
              </div>
            ))}
          </div>
          <div className="kite-view-all-row">
            <a href="#" className="kite-view-all-link">View all →</a>
          </div>
        </div>

        {/* IPO panel */}
        <div className="kite-market-card">
          <div className="kite-ipo-tabs">
            {['Upcoming IPOs', 'Economic Calendar', 'Earnings Calendar'].map(t => (
              <button key={t} className={`kite-ipo-tab${ipoTab === t ? ' active' : ''}`} onClick={() => setIpoTab(t)}>{t}</button>
            ))}
          </div>
          {ipoTab === 'Upcoming IPOs' && (
            <>
              <div className="kite-ipo-status"><span className="kite-live-dot" /> LIVE IPOS</div>
              {liveIpos.map(ipo => (
                <div key={ipo.name} className="kite-ipo-row">
                  <div className="kite-ipo-logo" style={{ background: ipo.color }}>{ipo.ticker.slice(0,2)}</div>
                  <div className="kite-ipo-info">
                    <span className="kite-ipo-name">{ipo.name}</span>
                    <span className="kite-ipo-ticker">{ipo.ticker}</span>
                  </div>
                  <div className="kite-ipo-dates">{ipo.dates}</div>
                </div>
              ))}
              <div className="kite-ipo-status" style={{ paddingTop: 12 }}>UPCOMING IPOS</div>
              {upcomingIpos.map(ipo => (
                <div key={ipo.name} className="kite-ipo-row">
                  <div className="kite-ipo-logo" style={{ background: ipo.color }}>{ipo.ticker.slice(0,2)}</div>
                  <div className="kite-ipo-info">
                    <span className="kite-ipo-name">{ipo.name}</span>
                    <span className="kite-ipo-ticker">{ipo.ticker}</span>
                  </div>
                  <div className="kite-ipo-dates">{ipo.dates}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Market Overview (spans full width) */}
        <div className="kite-market-card kite-overview-card">
          <div className="kite-overview-inner">
            <div className="kite-overview-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4184f3" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Market overview
              <span style={{ marginLeft: 4, fontSize: 11, color: '#aaa' }}>■ NIFTY 50</span>
              {!marketLoading && marketCandles.length > 0 && (() => {
                const last = marketCandles[marketCandles.length - 1];
                const prev = marketCandles[marketCandles.length - 2];
                const chg = prev ? last.close - prev.close : 0;
                const pct = prev ? (chg / prev.close) * 100 : 0;
                const up = chg >= 0;
                return (
                  <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: up ? '#28a745' : '#e84040' }}>
                    {Number(last.close).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    &nbsp;{up ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
                  </span>
                );
              })()}
              {onOpenChart && (
                <button
                  onClick={() => onOpenChart('NIFTY 50')}
                  style={{
                    background: 'none', border: '1px solid #4184f3', color: '#4184f3',
                    borderRadius: 4, padding: '2px 8px', fontSize: 11, cursor: 'pointer',
                    marginLeft: 8, fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Full Chart
                </button>
              )}
            </div>
            <div className="kite-chart-area">
              {marketLoading
                ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ccc', fontSize: 12 }}>Loading chart…</div>
                : <SparkLine candles={marketCandles} />
              }
            </div>
            <div className="kite-chart-labels">
              <span>Oct 25</span><span>Jan 26</span><span>Apr 26</span><span>Jul 26</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
