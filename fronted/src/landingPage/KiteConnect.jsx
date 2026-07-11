export default function KiteConnect() {
  return (
    <section className="kc-banner-homepage">
      <div className="kc-banner-container container">
        <img
          src="https://zerodha.com/static/images/kc-logo-landing.svg"
          alt="kite connect logo"
        />
        <span className="text-grey">
          Need more? Build your own trading and investing experience with Kite Connect, simple HTTP
          APIs to place orders, stream market data, manage your account, and more.{' '}
          <a href="https://zerodha.com/products/api">
            Explore <span className="icon icon-arrow-right"></span>
          </a>
        </span>
        <img
          className="kc-banner-image hide-on-mobile"
          src="https://zerodha.com/static/images/kc-banner-image.svg"
          alt=""
        />
      </div>
    </section>
  );
}
