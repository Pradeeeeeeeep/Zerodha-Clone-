import { Link } from 'react-router-dom';
import landingSvg from './assets/landing.svg';

export default function Hero() {
  return (
    <section className="text-center landing">
      <div className="container">
        <img
          className="landing-image"
          src={landingSvg}
          alt="Online stock brokerage platform for trading and investing in stocks, futures, options, commodities, currency, ETFs, mutual funds, and bonds."
        />
        <h1 className="landing-heading text-center">Invest in everything</h1>
        <p className="landing-subheading text-center">
          Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.
        </p>
        <Link to="/open-account" className="button" id="acop_link">
          Sign up for free
        </Link>
      </div>
    </section>
  );
}
