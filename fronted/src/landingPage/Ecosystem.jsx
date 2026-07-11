import ecosystemPng from './assets/ecosystem.png';

export default function Ecosystem() {
  return (
    <section className="ecosystem">
      <div className="container">
        <div className="row between middle">
          {/* Left: trust points */}
          <div className="five columns">
            <h2>Trust with confidence</h2>

            <div className="why-us-section">
              <h3>Customer-first always</h3>
              <p>
                That&apos;s why{' '}
                <span className="client-count">1.6+ crore</span> customers trust Zerodha with{' '}
                <span className="aum-value">~ ₹6 lakh crores</span> of equity investments, making
                us India&apos;s largest broker; contributing to 15% of daily retail exchange volumes
                in India.
              </p>
            </div>

            <div className="why-us-section">
              <h3>No spam or gimmicks</h3>
              <p>
                No gimmicks, spam, &quot;gamification&quot;, or annoying push notifications. High
                quality apps that you use at your pace, the way you like.{' '}
                <a href="https://zerodha.com/about/philosophy">Our philosophies.</a>
              </p>
            </div>

            <div className="why-us-section">
              <h3>The Zerodha universe</h3>
              <p>
                Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups
                offer you tailored services specific to your needs.
              </p>
            </div>

            <div className="why-us-section">
              <h3>Do better with money</h3>
              <p>
                With initiatives like{' '}
                <a
                  href="https://support.zerodha.com/category/trading-and-markets/kite-features/nudges/articles/what-is-nudge"
                  target="_blank"
                  rel="noreferrer"
                >
                  Nudge
                </a>{' '}
                and{' '}
                <a
                  href="https://support.zerodha.com/category/console/profile/killswitch/articles/what-is-the-kill-switch"
                  target="_blank"
                  rel="noreferrer"
                >
                  Kill Switch
                </a>
                , we don&apos;t just facilitate transactions, but actively help you do better with
                your money.
              </p>
            </div>
          </div>

          {/* Right: ecosystem image */}
          <div className="seven columns">
            <div className="text-center">
              <a href="https://zerodha.com/products">
                <img
                  src={ecosystemPng}
                  alt="The Zerodha Universe"
                  className="ecosystem-image"
                />
              </a>
            </div>
            <p className="text-center">
              <a href="https://zerodha.com/products">
                Explore our products<i className="icon-arrow-right"></i>
              </a>
              <a className="demo-link" href="https://kite-demo.zerodha.com">
                Try Kite demo <i className="icon-arrow-right"></i>
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
