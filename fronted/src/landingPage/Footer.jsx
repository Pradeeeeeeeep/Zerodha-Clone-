import logoSvg from './assets/logo.svg';
import googlePlaySvg from './assets/google-play-badge-light.svg';
import appStoreSvg from './assets/appstore-badge-light.svg';

export default function Footer() {
  return (
    <footer id="footer">
      <div className="container">
        <div className="row between main-footer text-14">
          {/* Brand column */}
          <div className="columns three">
            <div className="footer-logo">
              <img src={logoSvg} alt="Zerodha" />
            </div>
            <p className="copyright text-grey">© 2010 - 2026, Zerodha Broking Ltd.</p>
            <p className="copyright text-grey">All rights reserved.</p>

            <ul className="social">
              <li>
                <a target="_blank" rel="noreferrer" href="https://x.com/zerodha">
                  <img src="https://zerodha.com/static/images/x-twitter.svg" alt="X (Twitter)" />
                </a>
              </li>
              <li>
                <a target="_blank" rel="noreferrer" href="https://facebook.com/zerodha.social">
                  <i className="icon-facebook-official"></i>
                </a>
              </li>
              <li>
                <a target="_blank" rel="noreferrer" href="https://instagram.com/zerodhaonline/">
                  <i className="icon-instagram"></i>
                </a>
              </li>
              <li>
                <a target="_blank" rel="noreferrer" href="https://linkedin.com/company/zerodha">
                  <i className="icon-linkedin"></i>
                </a>
              </li>
            </ul>
            <hr />
            <ul className="social">
              <li>
                <a target="_blank" rel="noreferrer" href="https://www.youtube.com/@zerodhaonline">
                  <img
                    className="youtube-logo"
                    src="https://zerodha.com/static/images/youtube.svg"
                    alt="YouTube"
                  />
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://whatsapp.com/channel/0029Va8tzF0EquiIIb9j791g"
                >
                  <img
                    className="whatsapp-logo"
                    src="https://zerodha.com/static/images/whatsapp-logo.svg"
                    alt="WhatsApp"
                  />
                </a>
              </li>
              <li>
                <a target="_blank" rel="noreferrer" href="https://t.me/zerodhain">
                  <i className="icon-telegram"></i>
                </a>
              </li>
            </ul>

            <div className="app-badges">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://play.google.com/store/apps/details?id=com.zerodha.kite3"
              >
                <img src={googlePlaySvg} alt="Get it on Google Play" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://apps.apple.com/in/app/kite-zerodha/id1449453802"
              >
                <img src={appStoreSvg} alt="Download on the App Store" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="columns nine">
            <div className="row between">
              {/* Account */}
              <div className="columns three">
                <ul className="list-style">
                  <li className="nav-head">Account</li>
                  <li><a href="https://zerodha.com/open-account/">Open demat account</a></li>
                  <li><a href="https://zerodha.com/open-account/minor/">Minor demat account</a></li>
                  <li><a href="https://zerodha.com/open-account/nri/">NRI demat account</a></li>
                  <li><a href="https://zerodha.com/open-account/huf/">HUF demat account</a></li>
                  <li><a href="https://zerodha.com/commodities/">Commodity</a></li>
                  <li><a href="https://zerodha.com/dematerialise/">Dematerialisation</a></li>
                  <li><a href="https://zerodha.com/fund-transfer/">Fund transfer</a></li>
                  <li><a href="https://zerodha.com/mtf/">MTF</a></li>
                </ul>
              </div>

              {/* Support */}
              <div className="columns three">
                <ul className="list-style">
                  <li className="nav-head">Support</li>
                  <li><a href="https://zerodha.com/contact/">Contact us</a></li>
                  <li><a href="https://support.zerodha.com">Support portal</a></li>
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href="https://support.zerodha.com/category/your-zerodha-account/your-profile/ticket-creation/articles/how-do-i-create-a-ticket-at-zerodha"
                    >
                      How to file a complaint?
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href="https://support.zerodha.com/category/your-zerodha-account/your-profile/ticket-creation/articles/track-complaints-or-tickets"
                    >
                      Status of your complaints
                    </a>
                  </li>
                  <li><a href="https://zerodha.com/marketintel/bulletin/">Bulletin</a></li>
                  <li><a href="https://zerodha.com/marketintel/circulars/">Circular</a></li>
                  <li><a href="https://zerodha.com/z-connect/">Z-Connect blog</a></li>
                  <li><a href="https://zerodha.com/resources/">Downloads</a></li>
                </ul>
              </div>

              {/* Company */}
              <div className="columns three">
                <ul className="list-style">
                  <li className="nav-head">Company</li>
                  <li><a href="https://zerodha.com/about/">About</a></li>
                  <li><a href="https://zerodha.com/about/philosophy/">Philosophy</a></li>
                  <li><a href="https://zerodha.com/media/">Press &amp; media</a></li>
                  <li><a href="https://careers.zerodha.com/">Careers</a></li>
                  <li><a href="https://zerodha.com/cares/">Zerodha Cares (CSR)</a></li>
                  <li><a href="https://zerodha.tech/">Zerodha.tech</a></li>
                  <li><a href="https://zerodha.com/open-source/">Open source</a></li>
                  <li><a href="https://zerodha.com/refer/">Referral program</a></li>
                </ul>
              </div>

              {/* Quick links */}
              <div className="columns three">
                <ul className="list-style">
                  <li className="nav-head">Quick links</li>
                  <li><a href="https://zerodha.com/ipo/">Upcoming IPOs</a></li>
                  <li><a href="https://zerodha.com/charges/">Brokerage charges</a></li>
                  <li><a href="https://zerodha.com/marketintel/holiday-calendar/">Market holidays</a></li>
                  <li><a href="https://zerodha.com/markets/calendar/">Economic calendar</a></li>
                  <li><a href="https://zerodha.com/calculators/">Calculators</a></li>
                  <li><a href="https://zerodha.com/markets/stocks/">Markets</a></li>
                  <li><a href="https://zerodha.com/markets/sector/">Sectors</a></li>
                  <li><a href="https://zerodha.com/market/giftnifty/">Gift Nifty</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="row smallprint">
          <p>
            Zerodha Broking Ltd.: Member of NSE, BSE, MCX &amp; MSEI – SEBI Registration no.:
            INZ000031633 CDSL/NSDL: Depository services through Zerodha Broking Ltd. – SEBI
            Registration no.: IN-DP-431-2019 Registered Address: Zerodha Broking Ltd., #153/154,
            4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru
            - 560078, Karnataka, India. For any complaints pertaining to securities broking please
            write to{' '}
            <a href="mailto:complaints@zerodha.com">complaints@zerodha.com</a>, for DP related to{' '}
            <a href="mailto:dp@zerodha.com">dp@zerodha.com</a>. Please ensure you carefully read the
            Risk Disclosure Document as prescribed by SEBI | ICF
          </p>
          <p>
            Procedure to file a complaint on{' '}
            <a rel="nofollow" href="https://scores.sebi.gov.in/" target="_blank" rel="noreferrer">
              SEBI SCORES
            </a>
            : Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name,
            PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy
            redressal of the grievances
          </p>
          <p>
            <a rel="nofollow" href="https://smartodr.in/" target="_blank" rel="noreferrer">
              Smart Online Dispute Resolution
            </a>{' '}
            |{' '}
            <a
              href="https://zerodha-common.s3.ap-south-1.amazonaws.com/Downloads-and-resources/Smart%20ODR%20info.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Grievances Redressal Mechanism
            </a>
          </p>
          <p>Investments in securities market are subject to market risks; read all the related documents carefully before investing.</p>
          <p>
            India&apos;s largest broker based on networth as per NSE.{' '}
            <a
              rel="nofollow"
              href="https://enit.nseindia.com/MemDirWeb/brokerDetailPage_Beta?memID=2516&h_MemType=members&memName=ZERODHA%20BROKING%20LIMITED"
              target="_blank"
              rel="noreferrer"
            >
              NSE broker factsheet
            </a>
          </p>
        </div>

        {/* Exchange / policy links */}
        <div className="footer-graveyard-links text-center">
          <ul>
            {[
              { label: 'NSE', href: 'https://nseindia.com' },
              { label: 'BSE', href: 'https://www.bseindia.com/' },
              { label: 'MCX', href: 'https://www.mcxindia.com/' },
              { label: 'MSEI', href: 'https://mseindia.com/' },
              { label: 'Terms & conditions', href: 'https://zerodha.com/terms-and-conditions/' },
              { label: 'Policies & procedures', href: 'https://zerodha.com/policies-and-procedures/' },
              { label: 'Privacy policy', href: 'https://zerodha.com/privacy-policy/' },
              { label: 'Disclosure', href: 'https://zerodha.com/disclosure/' },
              { label: "For investor's attention", href: 'https://zerodha.com/investor-attention/' },
              { label: 'Investor charter', href: 'https://zerodha.com/tos/investor-charter/' },
              { label: 'Sitemap', href: 'https://zerodha.com/sitemap/' },
            ].map((link) => (
              <li key={link.label}>
                <a rel="nofollow" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
