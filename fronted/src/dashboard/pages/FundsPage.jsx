const equityItems = [
  { label: 'Available margin', value: '0.00', big: true },
  { label: 'Used margin',      value: '0.00', big: true },
  { label: 'Available cash',   value: '0.00', big: true },
];
const equityDetails = [
  { label: 'Opening balance',        value: '0.00' },
  { label: 'Payin',                  value: '0.00' },
  { label: 'Payout',                 value: '0.00' },
  { label: 'SPAN',                   value: '0.00' },
  { label: 'Delivery margin',        value: '0.00' },
  { label: 'Exposure',               value: '0.00' },
  { label: 'Options premium',        value: '0.00' },
  { label: 'Collateral (Liquid funds)', value: '0.00' },
  { label: 'Collateral (Equity)',    value: '0.00' },
  { label: 'Total collateral',       value: '0.00' },
];

export default function FundsPage() {
  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Alert */}
      <div className="kite-alert-banner">
        Our team is verifying your account opening application form. This takes up to 24 working hours. We will notify you once it's ready.
      </div>

      {/* Top actions */}
      <div className="kite-funds-top">
        <span className="kite-funds-upi-label">
          Instant, zero-cost fund transfers with
          <span style={{ fontWeight: 700, marginLeft: 4, color: '#555' }}>UPI</span>
        </span>
        <button className="kite-btn-add">Add funds</button>
        <button className="kite-btn-withdraw">Withdraw</button>
      </div>

      {/* Two-column grid */}
      <div className="kite-funds-grid">
        {/* Equity */}
        <div className="kite-funds-panel">
          <div className="kite-funds-panel-title">
            <div className="kite-funds-panel-title-inner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Equity
            </div>
            <div className="kite-funds-panel-actions">
              <a href="#">⊙ View statement</a>
              <a href="#">⊙ Help</a>
            </div>
          </div>
          {/* Big numbers */}
          <div className="kite-funds-top-items">
            {equityItems.map(item => (
              <div key={item.label} className="kite-funds-top-item">
                <span className="kite-funds-item-label">{item.label}</span>
                <span className="kite-funds-item-val-big">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="kite-funds-divider" />
          {/* Detail rows */}
          {equityDetails.map(item => (
            <div key={item.label} className="kite-funds-item">
              <span>{item.label}</span>
              <span className="kite-funds-item-val">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Commodity — identical structure */}
        <div className="kite-funds-panel">
          <div className="kite-funds-panel-title">
            <div className="kite-funds-panel-title-inner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 19 21 12 17 5 21 12 2"/>
              </svg>
              Commodity
            </div>
            <div className="kite-funds-panel-actions">
              <a href="#">⊙ View statement</a>
              <a href="#">⊙ Help</a>
            </div>
          </div>
          <div className="kite-funds-top-items">
            {equityItems.map(item => (
              <div key={item.label} className="kite-funds-top-item">
                <span className="kite-funds-item-label">{item.label}</span>
                <span className="kite-funds-item-val-big">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="kite-funds-divider" />
          {equityDetails.map(item => (
            <div key={item.label} className="kite-funds-item">
              <span>{item.label}</span>
              <span className="kite-funds-item-val">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
