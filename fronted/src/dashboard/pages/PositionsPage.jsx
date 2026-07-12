// Anchor icon for empty positions state
function AnchorIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 80 80" fill="none" stroke="#ccc" strokeWidth="1.5">
      <circle cx="40" cy="22" r="8"/>
      <line x1="40" y1="30" x2="40" y2="70"/>
      <path d="M20 42c0 0 4 18 20 18s20-18 20-18"/>
      <line x1="28" y1="22" x2="52" y2="22"/>
    </svg>
  );
}

export default function PositionsPage({ emptyMsg, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Alert */}
      <div className="kite-alert-banner">
        Our team is verifying your account opening application form. This takes up to 24 working hours. We will notify you once it's ready.
      </div>

      {/* Empty state */}
      <div className="kite-empty" style={{ flex: 1 }}>
        <div className="kite-empty-icon"><AnchorIcon /></div>
        <p>{emptyMsg || "You don't have any positions yet"}</p>
        <button className="kite-btn-blue">Get started</button>
        <span className="kite-link-blue">
          <span className="kite-link-icon">⊙</span>
          Analytics
        </span>
      </div>
    </div>
  );
}
