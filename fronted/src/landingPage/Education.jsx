import educationSvg from './assets/index-education.svg';

export default function Education() {
  return (
    <section>
      <div className="container">
        <div className="row between v-align">
          <div className="columns five text-center">
            <a href="https://zerodha.com/varsity/">
              <img className="img-margin" src={educationSvg} alt="Varsity" />
            </a>
          </div>
          <div className="columns six">
            <h2>Free and open market education</h2>
            <p>
              Varsity, the largest online stock market education book in the world covering
              everything from the basics to advanced trading.
            </p>
            <a href="https://zerodha.com/varsity">
              Varsity <i className="icon-arrow-right"></i>
            </a>
            <p className="space-top">
              TradingQ&amp;A, the most active trading and investment community in India for all your
              market related queries.
            </p>
            <a href="https://tradingqna.com">
              TradingQ&amp;A <i className="icon-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
