import { useState, useEffect, useRef, useCallback } from 'react';

// ── Constants ────────────────────────────────────────────────────────────────

const BACKEND_URL = 'http://localhost:8080';

const INTERVALS = [
  { label: '1m',   value: 'minute'   },
  { label: '3m',   value: '3minute'  },
  { label: '5m',   value: '5minute'  },
  { label: '15m',  value: '15minute' },
  { label: '30m',  value: '30minute' },
  { label: '1H',   value: '60minute' },
  { label: 'Day',  value: 'day'      },
];

const DATE_RANGES = [
  { label: '1W',  days: 7   },
  { label: '1M',  days: 30  },
  { label: '3M',  days: 90  },
  { label: '6M',  days: 180 },
  { label: '1Y',  days: 365 },
];

const DEFAULT_INSTRUMENTS = [
  { token: 256265,  symbol: 'NIFTY 50',   exchange: 'NSE', name: 'Nifty 50 Index'           },
  { token: 265,     symbol: 'SENSEX',      exchange: 'BSE', name: 'BSE Sensex'                },
  { token: 408065,  symbol: 'HDFCBANK',    exchange: 'NSE', name: 'HDFC Bank'                 },
  { token: 341249,  symbol: 'INFY',        exchange: 'NSE', name: 'Infosys'                   },
  { token: 2953217, symbol: 'TCS',         exchange: 'NSE', name: 'Tata Consultancy Services' },
  { token: 54,      symbol: 'RELIANCE',    exchange: 'NSE', name: 'Reliance Industries'       },
  { token: 897537,  symbol: 'BAJFINANCE',  exchange: 'NSE', name: 'Bajaj Finance'             },
  { token: 1270529, symbol: 'SBIN',        exchange: 'NSE', name: 'State Bank of India'       },
];

// ── Utility ──────────────────────────────────────────────────────────────────

function formatDate(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function formatTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
}

function formatPrice(n) {
  return Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Candlestick Chart (pure SVG) ─────────────────────────────────────────────

function CandlestickChart({ candles, width = 800, height = 360 }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  if (!candles || candles.length === 0) {
    return (
      <div className="chart-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <p>No data to display</p>
      </div>
    );
  }

  const PADDING = { top: 20, right: 60, bottom: 40, left: 10 };
  const chartW = width - PADDING.left - PADDING.right;
  const chartH = height - PADDING.top - PADDING.bottom;
  const volH   = Math.round(chartH * 0.18);
  const priceH = chartH - volH - 12;

  // Price range
  const highs  = candles.map(c => c.high);
  const lows   = candles.map(c => c.low);
  const maxP   = Math.max(...highs);
  const minP   = Math.min(...lows);
  const priceRange = maxP - minP || 1;

  // Volume range
  const maxVol = Math.max(...candles.map(c => c.volume)) || 1;

  const candleW = Math.max(1, (chartW / candles.length) * 0.7);
  const gap     = chartW / candles.length;

  // Coordinate helpers
  const toX    = i => PADDING.left + i * gap + gap / 2;
  const toY    = p => PADDING.top + priceH - ((p - minP) / priceRange) * priceH;
  const toVolY = v => PADDING.top + priceH + 12 + volH - (v / maxVol) * volH;

  // Y-axis grid lines
  const gridCount = 5;
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const pct = i / gridCount;
    const price = minP + pct * priceRange;
    const y = toY(price);
    return { y, price };
  });

  // X-axis labels (show ~6 evenly spaced)
  const labelStep = Math.max(1, Math.floor(candles.length / 6));
  const xLabels = candles
    .filter((_, i) => i % labelStep === 0)
    .map((c, idx) => ({ x: toX(idx * labelStep), label: formatTimestamp(c.timestamp) }));

  function handleMouseMove(e) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left - PADDING.left;
    const idx = Math.round(mx / gap);
    if (idx >= 0 && idx < candles.length) {
      setTooltip({ idx, x: toX(idx), candle: candles[idx] });
    }
  }

  return (
    <div className="chart-svg-wrapper" style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="chart-svg"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid lines */}
        {gridLines.map(({ y, price }, i) => (
          <g key={i}>
            <line x1={PADDING.left} y1={y} x2={width - PADDING.right} y2={y}
              stroke="#2a2a2a" strokeWidth="1" strokeDasharray="4,4" />
            <text x={width - PADDING.right + 6} y={y + 4}
              fill="#666" fontSize="10" fontFamily="Inter, sans-serif">
              {formatPrice(price)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map(({ x, label }, i) => (
          <text key={i} x={x} y={height - 8}
            fill="#555" fontSize="10" textAnchor="middle" fontFamily="Inter, sans-serif">
            {label}
          </text>
        ))}

        {/* Separator line between price and volume */}
        <line
          x1={PADDING.left} y1={PADDING.top + priceH + 6}
          x2={width - PADDING.right} y2={PADDING.top + priceH + 6}
          stroke="#1e1e1e" strokeWidth="1"
        />

        {/* Candles */}
        {candles.map((c, i) => {
          const x    = toX(i);
          const isBull = c.close >= c.open;
          const color  = isBull ? '#26a69a' : '#ef5350';
          const bodyTop = toY(Math.max(c.open, c.close));
          const bodyBot = toY(Math.min(c.open, c.close));
          const bodyH   = Math.max(1, bodyBot - bodyTop);

          // Volume bar
          const volY = toVolY(c.volume);
          const volBarH = (PADDING.top + priceH + 12 + volH) - volY;

          return (
            <g key={i}>
              {/* Wick */}
              <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)}
                stroke={color} strokeWidth="1" />
              {/* Body */}
              <rect
                x={x - candleW / 2} y={bodyTop}
                width={candleW} height={bodyH}
                fill={color}
                opacity={tooltip?.idx === i ? 1 : 0.85}
              />
              {/* Volume bar */}
              <rect
                x={x - candleW / 2} y={volY}
                width={candleW} height={Math.max(1, volBarH)}
                fill={color} opacity="0.5"
              />
            </g>
          );
        })}

        {/* Tooltip crosshair */}
        {tooltip && (
          <g>
            <line x1={tooltip.x} y1={PADDING.top} x2={tooltip.x} y2={height - PADDING.bottom}
              stroke="#4a4a4a" strokeWidth="1" strokeDasharray="3,3" />
            <line x1={PADDING.left} y1={toY(tooltip.candle.close)} x2={width - PADDING.right} y2={toY(tooltip.candle.close)}
              stroke="#4a4a4a" strokeWidth="1" strokeDasharray="3,3" />
          </g>
        )}
      </svg>

      {/* Floating tooltip */}
      {tooltip && (
        <div className="chart-tooltip" style={{
          left: tooltip.x > width * 0.6 ? 'auto' : `${(tooltip.x / width) * 100 + 2}%`,
          right: tooltip.x > width * 0.6 ? '4%' : 'auto',
        }}>
          <div className="chart-tt-date">{formatTimestamp(tooltip.candle.timestamp)}</div>
          <div className="chart-tt-row"><span>O</span><span className="chart-tt-val">{formatPrice(tooltip.candle.open)}</span></div>
          <div className="chart-tt-row"><span>H</span><span className="chart-tt-val green">{formatPrice(tooltip.candle.high)}</span></div>
          <div className="chart-tt-row"><span>L</span><span className="chart-tt-val red">{formatPrice(tooltip.candle.low)}</span></div>
          <div className="chart-tt-row"><span>C</span><span className={`chart-tt-val ${tooltip.candle.close >= tooltip.candle.open ? 'green' : 'red'}`}>
            {formatPrice(tooltip.candle.close)}
          </span></div>
          <div className="chart-tt-row"><span>V</span><span className="chart-tt-val">{Number(tooltip.candle.volume).toLocaleString('en-IN')}</span></div>
        </div>
      )}
    </div>
  );
}

// ── Main ChartsPage Component ─────────────────────────────────────────────────

export default function ChartsPage({ initialSymbol }) {
  const [instruments, setInstruments]   = useState(DEFAULT_INSTRUMENTS);
  const [selectedInst, setSelectedInst] = useState(null);
  const [interval, setInterval]         = useState('day');
  const [rangeDays, setRangeDays]       = useState(90);
  const [candles, setCandles]           = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [showSearch, setShowSearch]     = useState(false);

  // Load instruments from backend on mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/chart/instruments`)
      .then(r => r.json())
      .then(data => {
        setInstruments(data);
        // Auto-select NIFTY 50 or match initialSymbol
        const found = initialSymbol
          ? data.find(i => i.symbol === initialSymbol)
          : data[0];
        setSelectedInst(found || data[0]);
      })
      .catch(() => {
        // Use defaults if backend is down
        const found = initialSymbol
          ? DEFAULT_INSTRUMENTS.find(i => i.symbol === initialSymbol)
          : DEFAULT_INSTRUMENTS[0];
        setSelectedInst(found || DEFAULT_INSTRUMENTS[0]);
      });
  }, [initialSymbol]);

  // Fetch candles whenever instrument, interval, or range changes
  const fetchCandles = useCallback(() => {
    if (!selectedInst) return;
    setLoading(true);
    setError(null);

    const fromDate = formatDate(rangeDays);
    const toDate   = formatDate(0);
    const url = `${BACKEND_URL}/api/chart/historical?instrumentToken=${selectedInst.token}&interval=${interval}&from=${fromDate}&to=${toDate}`;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCandles(data);
        } else {
          throw new Error(data.message || 'Invalid response from server');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedInst, interval, rangeDays]);

  useEffect(() => { fetchCandles(); }, [fetchCandles]);

  // Derived stats for the header strip
  const last    = candles[candles.length - 1];
  const prev    = candles[candles.length - 2];
  const change  = last && prev ? last.close - prev.close : 0;
  const changePct = prev ? (change / prev.close) * 100 : 0;
  const isBull  = change >= 0;

  const filteredInst = instruments.filter(i =>
    i.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="charts-page">
      {/* ── Header strip ─────────────────────────────────────────── */}
      <div className="charts-header">
        <div className="charts-header-left">
          <div className="charts-symbol-selector" onClick={() => setShowSearch(!showSearch)}>
            <span className="charts-symbol-name">{selectedInst?.symbol || 'Loading...'}</span>
            <span className="charts-symbol-exch">{selectedInst?.exchange}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points={showSearch ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}/>
            </svg>
          </div>

          {last && (
            <div className="charts-price-strip">
              <span className="charts-ltp">{formatPrice(last.close)}</span>
              <span className={`charts-change ${isBull ? 'green' : 'red'}`}>
                {isBull ? '▲' : '▼'} {formatPrice(Math.abs(change))} ({Math.abs(changePct).toFixed(2)}%)
              </span>
              <span className="charts-ohlc">
                O:{formatPrice(last.open)}&nbsp; H:{formatPrice(last.high)}&nbsp;
                L:{formatPrice(last.low)}&nbsp; C:{formatPrice(last.close)}
              </span>
            </div>
          )}
        </div>

        <div className="charts-header-right">
          {/* Interval selector */}
          <div className="charts-interval-bar">
            {INTERVALS.map(iv => (
              <button
                key={iv.value}
                className={`charts-iv-btn${interval === iv.value ? ' active' : ''}`}
                onClick={() => setInterval(iv.value)}
              >
                {iv.label}
              </button>
            ))}
          </div>

          {/* Date range selector */}
          <div className="charts-range-bar">
            {DATE_RANGES.map(r => (
              <button
                key={r.days}
                className={`charts-range-btn${rangeDays === r.days ? ' active' : ''}`}
                onClick={() => setRangeDays(r.days)}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button className="charts-refresh-btn" onClick={fetchCandles} title="Refresh">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Instrument search dropdown ─────────────────────────── */}
      {showSearch && (
        <div className="charts-search-dropdown">
          <input
            type="text"
            className="charts-search-input"
            placeholder="Search symbol or name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />
          <div className="charts-search-list">
            {filteredInst.map(inst => (
              <div
                key={inst.token}
                className={`charts-search-row${selectedInst?.token === inst.token ? ' selected' : ''}`}
                onClick={() => { setSelectedInst(inst); setShowSearch(false); setSearchQuery(''); }}
              >
                <span className="charts-search-sym">{inst.symbol}</span>
                <span className="charts-search-exch">{inst.exchange}</span>
                <span className="charts-search-name">{inst.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Chart area ───────────────────────────────────────────── */}
      <div className="charts-body">
        {loading && (
          <div className="charts-loading">
            <div className="charts-spinner" />
            <span>Loading chart data...</span>
          </div>
        )}

        {error && !loading && (
          <div className="charts-error">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef5350" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{error}</p>
            <button onClick={fetchCandles}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="charts-candle-count">
              {candles.length} candles · {selectedInst?.name}
            </div>
            <div className="charts-canvas-wrapper">
              <CandlestickChart candles={candles} width={1100} height={420} />
            </div>

            {/* Summary cards */}
            {last && (
              <div className="charts-summary-row">
                {[
                  { label: 'Open',   value: formatPrice(last.open),   color: '#aaa' },
                  { label: 'High',   value: formatPrice(last.high),   color: '#26a69a' },
                  { label: 'Low',    value: formatPrice(last.low),    color: '#ef5350' },
                  { label: 'Close',  value: formatPrice(last.close),  color: isBull ? '#26a69a' : '#ef5350' },
                  { label: 'Volume', value: Number(last.volume).toLocaleString('en-IN'), color: '#aaa' },
                ].map(s => (
                  <div key={s.label} className="charts-summary-card">
                    <span className="charts-summary-label">{s.label}</span>
                    <span className="charts-summary-val" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .charts-page {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #111;
          color: #e0e0e0;
          font-family: 'Inter', 'Roboto', sans-serif;
          overflow: hidden;
        }

        /* ── Header ── */
        .charts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: #161616;
          border-bottom: 1px solid #222;
          flex-wrap: wrap;
          gap: 10px;
          flex-shrink: 0;
        }
        .charts-header-left { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .charts-header-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

        .charts-symbol-selector {
          display: flex; align-items: center; gap: 6px;
          cursor: pointer; padding: 5px 10px;
          background: #1e1e1e; border-radius: 6px;
          border: 1px solid #2a2a2a; transition: border-color .2s;
          user-select: none;
        }
        .charts-symbol-selector:hover { border-color: #555; }
        .charts-symbol-name { font-weight: 600; font-size: 15px; color: #fff; }
        .charts-symbol-exch { font-size: 10px; color: #888; background: #2a2a2a; padding: 1px 5px; border-radius: 3px; }

        .charts-price-strip { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .charts-ltp { font-size: 20px; font-weight: 700; color: #fff; }
        .charts-change { font-size: 13px; font-weight: 600; }
        .charts-ohlc { font-size: 11px; color: #777; }
        .green { color: #26a69a; }
        .red   { color: #ef5350; }

        /* ── Controls ── */
        .charts-interval-bar, .charts-range-bar {
          display: flex; gap: 2px;
          background: #1e1e1e; border-radius: 6px; padding: 3px;
          border: 1px solid #2a2a2a;
        }
        .charts-iv-btn, .charts-range-btn {
          background: none; border: none; color: #888;
          padding: 4px 9px; border-radius: 4px; font-size: 12px;
          cursor: pointer; transition: all .15s; font-family: inherit;
        }
        .charts-iv-btn:hover, .charts-range-btn:hover { color: #ccc; background: #2a2a2a; }
        .charts-iv-btn.active, .charts-range-btn.active {
          background: #e84040; color: #fff; font-weight: 600;
        }

        .charts-refresh-btn {
          background: #1e1e1e; border: 1px solid #2a2a2a; color: #888;
          border-radius: 6px; padding: 5px 8px; cursor: pointer;
          display: flex; align-items: center; transition: all .15s;
        }
        .charts-refresh-btn:hover { color: #fff; border-color: #555; }

        /* ── Search dropdown ── */
        .charts-search-dropdown {
          position: absolute; top: 44px; left: 16px; z-index: 100;
          background: #1a1a1a; border: 1px solid #2a2a2a;
          border-radius: 8px; width: 360px; box-shadow: 0 8px 24px rgba(0,0,0,.6);
        }
        .charts-search-input {
          width: 100%; box-sizing: border-box;
          background: #111; border: none; border-bottom: 1px solid #2a2a2a;
          color: #fff; padding: 10px 14px; font-size: 13px; font-family: inherit;
          border-radius: 8px 8px 0 0; outline: none;
        }
        .charts-search-list { max-height: 300px; overflow-y: auto; }
        .charts-search-row {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 14px; cursor: pointer; transition: background .12s;
        }
        .charts-search-row:hover, .charts-search-row.selected { background: #252525; }
        .charts-search-sym { font-weight: 600; font-size: 13px; color: #fff; min-width: 90px; }
        .charts-search-exch { font-size: 10px; color: #888; background: #2a2a2a; padding: 1px 5px; border-radius: 3px; }
        .charts-search-name { font-size: 12px; color: #666; truncate: true; }

        /* ── Body ── */
        .charts-body {
          flex: 1; overflow-y: auto; padding: 12px 16px;
          position: relative; display: flex; flex-direction: column; gap: 12px;
        }

        /* ── Loading / Error / Empty ── */
        .charts-loading, .charts-error, .chart-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 12px; color: #555;
          padding: 60px 20px; text-align: center;
        }
        .charts-spinner {
          width: 32px; height: 32px; border: 3px solid #2a2a2a;
          border-top-color: #e84040; border-radius: 50%;
          animation: spin .8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .charts-error button {
          background: #e84040; color: #fff; border: none;
          padding: 7px 18px; border-radius: 5px; cursor: pointer; font-size: 13px;
        }

        /* ── Chart canvas ── */
        .charts-candle-count { font-size: 11px; color: #444; }
        .charts-canvas-wrapper {
          background: #161616; border-radius: 8px; border: 1px solid #222;
          overflow: hidden;
        }
        .chart-svg-wrapper { position: relative; width: 100%; }
        .chart-svg { display: block; width: 100%; }

        /* ── Tooltip ── */
        .chart-tooltip {
          position: absolute; top: 16px;
          background: rgba(20,20,20,0.95); border: 1px solid #333;
          border-radius: 6px; padding: 8px 12px; min-width: 130px;
          font-size: 12px; pointer-events: none; z-index: 10;
          box-shadow: 0 4px 16px rgba(0,0,0,.5);
        }
        .chart-tt-date { color: #888; margin-bottom: 6px; font-size: 11px; }
        .chart-tt-row { display: flex; justify-content: space-between; gap: 16px; margin: 2px 0; color: #666; }
        .chart-tt-val { font-weight: 600; color: #ccc; }
        .chart-tt-val.green { color: #26a69a; }
        .chart-tt-val.red   { color: #ef5350; }

        /* ── Summary cards ── */
        .charts-summary-row {
          display: flex; gap: 10px; flex-wrap: wrap;
        }
        .charts-summary-card {
          background: #161616; border: 1px solid #222; border-radius: 8px;
          padding: 10px 16px; display: flex; flex-direction: column; gap: 3px;
          min-width: 110px; flex: 1;
        }
        .charts-summary-label { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: .5px; }
        .charts-summary-val { font-size: 15px; font-weight: 600; }
      `}</style>
    </div>
  );
}
