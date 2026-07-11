export default function Pricing() {
  return (
    <section className="pricing">
      <div className="container">
        <div className="row v-align around">
          {/* Left: text */}
          <div className="columns five">
            <h2>Unbeatable pricing</h2>
            <p>
              We pioneered the concept of discount broking and price transparency in India. Flat
              fees and no hidden charges.
            </p>
          </div>

          {/* Right: pricing boxes in a flex row */}
          <div className="columns seven">
            <div className="pricing-boxes">
              <div className="pricing-box">
                <img src="https://zerodha.com/static/images/pricing-eq.svg" alt="Free" />
                <p>
                  Free account
                  <br />
                  opening
                </p>
              </div>
              <div className="pricing-box">
                <img src="https://zerodha.com/static/images/pricing-eq.svg" alt="Free" />
                <p>
                  Free equity delivery
                  <br />
                  and direct mutual funds
                </p>
              </div>
              <div className="pricing-box">
                <img src="https://zerodha.com/static/images/other-trades.svg" alt="₹20" />
                <p>
                  Intraday and
                  <br />
                  F&amp;O
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="pricing-link">
          <a href="https://zerodha.com/charges/">
            See pricing <i className="icon-arrow-right"></i>
          </a>
        </p>
      </div>
    </section>
  );
}
