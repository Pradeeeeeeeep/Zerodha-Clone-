import { useState, useEffect, useRef } from 'react';
import logoSvg from './assets/logo.svg';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-responsive row between" ref={menuRef}>
          {/* Logo */}
          <div className="relative-section five columns">
            <a href="/">
              <img className="logo-img" src={logoSvg} alt="Zerodha logo" />
            </a>
          </div>

          {/* Desktop nav links */}
          <div className="nav-active seven columns" role="navigation" aria-label="main navigation">
            <ul className="navbar-links">
              <li className="hide-on-small">
                <a id="nav_acop" href="https://zerodha.com/open-account/">Signup</a>
              </li>
              <li className="hide-on-small">
                <a className="nav-links" href="https://zerodha.com/about/">About</a>
              </li>
              <li className="hide-on-small">
                <a className="nav-links" href="https://zerodha.com/products/">Products</a>
              </li>
              <li className="hide-on-small">
                <a className="nav-links" href="https://zerodha.com/pricing/">Pricing</a>
              </li>
              <li className="hide-on-small">
                <a href="https://support.zerodha.com">Support</a>
              </li>

              {/* Hamburger + dropdown */}
              <li id="navbar_menu">
                <div
                  className="cursor-pointer"
                  id="menu_btn"
                  title="Menu"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <div id="nav-icon3" className={menuOpen ? 'open' : ''}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>

                {/* Desktop dropdown */}
                <div id="menu" className={`navbar-menu${menuOpen ? ' show' : ''}`}>
                  {/* Mobile-only top links */}
                  <ul className="navbar-links show-on-mobile">
                    <li className="nav-links">
                      <a href="https://zerodha.com/open-account/">Signup</a>
                    </li>
                    <li>
                      <a className="nav-links" href="https://zerodha.com/about/">About</a>
                    </li>
                    <li>
                      <a className="nav-links" href="https://zerodha.com/products/">Products</a>
                    </li>
                    <li>
                      <a className="nav-links" href="https://zerodha.com/pricing/">Pricing</a>
                    </li>
                    <li>
                      <a target="_blank" rel="noreferrer" href="https://support.zerodha.com">Support</a>
                    </li>
                  </ul>

                  {/* Products grid */}
                  <div className="row between v-align products-list">
                    <div className="three columns">
                      <a className="text-center" href="https://kite.zerodha.com">
                        <img src="https://zerodha.com/static/images/products/kite-logo.svg" alt="Kite" />
                        <br className="hide-on-mobile" />
                        <span><strong>Kite</strong></span>
                        <br className="hide-on-small" />
                        <span className="text-light-grey text-12 hide-on-small">Trading platform</span>
                      </a>
                    </div>
                    <div className="three columns">
                      <a className="text-center" href="https://console.zerodha.com">
                        <img src="https://zerodha.com/static/images/products/console.svg" alt="Console" />
                        <br className="hide-on-mobile" />
                        <span><strong>Console</strong></span>
                        <br className="hide-on-small" />
                        <span className="text-light-grey text-12 hide-on-small">Backoffice</span>
                      </a>
                    </div>
                    <div className="three columns">
                      <a className="text-center" href="https://zerodha.com/products/api/">
                        <img src="https://zerodha.com/static/images/products/kite-connect.svg" alt="Kite Connect" />
                        <br className="hide-on-mobile" />
                        <span><strong>Kite Connect</strong></span>
                        <br className="hide-on-small" />
                        <span className="text-light-grey text-12 hide-on-small">Trading APIs</span>
                      </a>
                    </div>
                    <div className="three columns">
                      <a className="text-center" href="https://coin.zerodha.com">
                        <img src="https://zerodha.com/static/images/products/coin.svg" alt="Coin" />
                        <br className="hide-on-mobile" />
                        <span><strong>Coin</strong></span>
                        <br className="hide-on-small" />
                        <span className="text-light-grey text-12 hide-on-small">Mutual funds</span>
                      </a>
                    </div>
                    {/* Mobile-only edu */}
                    <div className="three columns show-on-mobile">
                      <a href="https://zerodha.com/varsity/" className="text-center">
                        <img className="nav-edu-img" src="https://zerodha.com/static/images/products/varsity.png" alt="Varsity" />
                        <br />
                        <span><strong>Varsity</strong></span>
                      </a>
                    </div>
                    <div className="three columns show-on-mobile">
                      <a href="https://tradingqna.com/" className="text-center">
                        <img className="nav-edu-img" src="https://zerodha.com/static/images/products/tqna.png" alt="Trading Q&A" />
                        <br />
                        <span><strong>Trading Q&amp;A</strong></span>
                      </a>
                    </div>
                  </div>

                  {/* Footer links */}
                  <div className="menu-footer">
                    <div className="row between">
                      <div className="seven columns">
                        <div className="row between">
                          <div className="six columns">
                            <p><strong>Utilities</strong></p>
                            <a href="https://zerodha.com/calculators/">Calculators</a>
                            <a href="https://zerodha.com/brokerage-calculator/">Brokerage calculator</a>
                            <a href="https://zerodha.com/margin-calculator/">Margin calculator</a>
                            <a href="https://zerodha.com/calculators/sip-calculator/">SIP calculator</a>
                          </div>
                          <div className="six columns">
                            <p><strong>Updates</strong></p>
                            <a href="https://zerodha.com/z-connect/">Z-Connect blog</a>
                            <a href="https://zerodha.com/marketintel/bulletin/">Circulars / Bulletin</a>
                            <a href="https://zerodha.com/ipo/">IPOs</a>
                            <a href="https://zerodha.com/markets/stocks/">Markets</a>
                          </div>
                        </div>
                      </div>
                      <div className="five columns education hide-on-small">
                        <p><strong>Education</strong></p>
                        <a href="https://zerodha.com/varsity/" className="text-center">
                          <img src="https://zerodha.com/static/images/products/varsity.png" alt="Varsity" />
                          <br />
                          <span>Varsity</span>
                        </a>
                        <a href="https://tradingqna.com/" className="text-center">
                          <img src="https://zerodha.com/static/images/products/tqna.png" alt="Trading Q&A" />
                          <br />
                          <span>Trading Q&amp;A</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
