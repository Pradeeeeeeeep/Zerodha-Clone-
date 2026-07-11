import Navbar from './Navbar';
import Hero from './Hero';
import Ecosystem from './Ecosystem';
import KiteConnect from './KiteConnect';
import Pricing from './Pricing';
import Education from './Education';
import OpenAccount from './OpenAccount';
import Footer from './Footer';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="content parent-content">
        <main className="content">
          <div className="homepage">
            <Hero />
            <Ecosystem />
            <KiteConnect />
            <Pricing />
            <Education />
          </div>
          <OpenAccount />
        </main>
      </main>
      <Footer />
    </>
  );
}
