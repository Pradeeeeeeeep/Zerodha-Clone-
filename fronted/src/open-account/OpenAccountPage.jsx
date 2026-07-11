import { useState } from 'react';
import Navbar from '../landingPage/Navbar';
import Footer from '../landingPage/Footer';
import '../landingPage/LandingPage.css';
import './OpenAccountPage.css';

// ---- Investment Options ----
const investmentOptions = [
  {
    img: 'https://zerodha.com/static/images/stocks-acop.svg',
    alt: 'invest in stocks',
    title: 'Stocks',
    desc: 'Invest in all exchange-listed securities',
  },
  {
    img: 'https://zerodha.com/static/images/mf-acop.svg',
    alt: 'invest in mutual funds',
    title: 'Mutual funds',
    desc: 'Invest in commission-free direct mutual funds',
  },
  {
    img: 'https://zerodha.com/static/images/ipo-acop.svg',
    alt: 'invest in IPO',
    title: 'IPO',
    desc: 'Apply to the latest IPOs instantly via UPI',
  },
  {
    img: 'https://zerodha.com/static/images/fo-acop.svg',
    alt: 'invest in Futures and Options',
    title: 'Futures & options',
    desc: 'Hedge and mitigate market risk through simplified F&O trading',
  },
];

// ---- Account Types ----
const accountTypes = [
  {
    img: 'https://zerodha.com/static/images/acop-individual.svg',
    alt: 'individual account',
    title: 'Individual Account',
    desc: 'Invest in equity, mutual funds and derivatives',
    href: 'https://zerodha.com/open-account/',
  },
  {
    img: 'https://zerodha.com/static/images/acop-huf.svg',
    alt: 'HUF account',
    title: 'HUF Account',
    desc: 'Make tax-efficient investments for your family',
    href: 'https://zerodha.com/open-account/huf/',
  },
  {
    img: 'https://zerodha.com/static/images/acop-nri.svg',
    alt: 'NRI account',
    title: 'NRI Account',
    desc: 'Invest in equity, mutual funds, debentures, and more',
    href: 'https://zerodha.com/open-account/nri/',
  },
  {
    img: 'https://zerodha.com/static/images/acop-minor.svg',
    alt: 'minor account',
    title: 'Minor Account',
    desc: "Teach your little ones about money & invest for their future with them",
    href: 'https://zerodha.com/open-account/minor/',
  },
  {
    img: 'https://zerodha.com/static/images/acop-corporate.svg',
    alt: 'corporate account',
    title: 'Corporate / LLP / Partnership',
    desc: 'Manage your business surplus and investments easily',
    href: 'https://support.zerodha.com/category/account-opening/company-partnership-and-huf-account-opening',
  },
];

// ---- FAQs ----
const faqs = [
  {
    q: 'What is a Zerodha account',
    a: 'A Zerodha account is a combined demat and trading account that allows investors to buy, sell, and hold securities digitally.',
  },
  {
    q: 'What documents are required to open a demat account?',
    aHtml: (
      <>
        <p>The following documents are required to open a Zerodha account online:</p>
        <ul>
          <li>PAN number</li>
          <li>Aadhaar Card (Linked with a phone number for OTP verification)</li>
          <li>Cancelled cheque or bank account statement (To link your bank account)</li>
          <li>Income proof (Required only if you wish to trade in Futures &amp; options)</li>
        </ul>
      </>
    ),
  },
  {
    q: 'Is Zerodha account opening free?',
    a: 'Yes, It is completely free.',
  },
  {
    q: 'Are there any AMC (Account Maintenance Charges) for a demat account?',
    aHtml: (
      <p>
        There is no AMC for the first year on all new resident individual accounts opened from June 1,
        2026. From the second year, charges depend on the account type.<br />
        For Basic Services Demat Account (BSDA): Zero charges on holdings up to ₹4 lakh; ₹100/year
        between ₹4 lakh and ₹10 lakh.<br />
        For non-Basic Services Demat Account: ₹300 per year + GST.<br />
        To learn more about BSDA,{' '}
        <a
          href="https://support.zerodha.com/category/account-opening/online-account-opening/online-account-opening-process/articles/how-to-open-a-basic-service-demat-account-at-zerodha"
          target="_blank"
          rel="noreferrer"
        >
          Click here
        </a>
        .
      </p>
    ),
  },
  {
    q: 'Can I open a demat account without a bank account?',
    aHtml: (
      <p>
        To open a demat account, you must have a bank account in your name.<br />
        If UPI verification is completed successfully, no proof of bank is needed. However, if bank
        verification fails, you&apos;ll need to provide either a cancelled cheque or a bank statement
        to link your bank account to Zerodha.
      </p>
    ),
  },
  {
    q: 'What is a Basic Services Demat Account (BSDA)?',
    a: 'BSDA is a demat account designed for retail investors with smaller holdings. It automatically applies if you have only one demat account per PAN and holdings of up to ₹10 lakhs in it. You will not be charged any Account Maintenance Charge (AMC) for holdings up to ₹4 lakhs value, and only ₹25/quarter if holdings are between ₹4 lakhs and ₹10 lakhs.',
  },
  {
    q: 'Can I open a demat and trading account using the mobile app?',
    a: 'Yes, You can open a demat and trading account completely online using the Zerodha Kite mobile app, available on Android and iOS.',
  },
];

export default function OpenAccountPage() {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    // In a real app this would call the Zerodha API
    window.open(`https://zerodha.com/open-account/?mobile=${mobile}`, '_blank');
  }

  return (
    <>
      <Navbar />

      <main className="content parent-content">

        {/* ── 1. HERO HEADING ─────────────────────────── */}
        <div className="acop-head hide-on-mobile">
          <div className="container">
            <h1 className="text-center">Open a free demat and trading account online</h1>
            <p className="acop-subheading text-center text-grey">
              Start investing brokerage free and join a community of{' '}
              <span className="client-count">1.6+ crore</span> investors and traders
            </p>
          </div>
        </div>

        {/* ── 2. SIGNUP FORM ──────────────────────────── */}
        <div className="account-open-sections acop-landing">
          <div className="container">
            <div className="row v-align evenly">
              {/* Left: illustration */}
              <div className="six columns account-illus text-center">
                <img
                  src="https://zerodha.com/static/images/account_open.svg"
                  alt="Open account illustration"
                />
              </div>

              {/* Right: signup form */}
              <div className="six columns center-on-mobile account-open-signup">
                <h1 className="show-on-mobile mobile-heading" style={{ fontSize: '1.25rem', marginBottom: 20 }}>
                  Open a free demat &amp; trading account online
                </h1>
                <h2 className="signup-head">Signup now</h2>
                <span className="signup-help color-grey">Or track your existing application</span>

                <form id="open_account_form" onSubmit={handleSubmit}>
                  <div className="mobile-input-row">
                    <span className="mobile-prefix">
                      <img
                        src="https://zerodha.com/static/images/india-flag.svg"
                        alt="India flag"
                      />
                      +91
                      <span className="nri-link">
                        NRI account?{' '}
                        <a href="https://zerodha.com/open-account/nri/">Click here</a>
                      </span>
                    </span>
                    <input
                      type="number"
                      autoFocus
                      min="1000000000"
                      max="9999999999"
                      name="mobile"
                      id="user_mobile"
                      placeholder="Enter your mobile number"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      required
                    />
                  </div>
                  <p className="help-text error-message text-12">{error}</p>

                  <input type="hidden" name="source" value="zerodha" />
                  <input type="hidden" name="partner_id" value="" />

                  <div className="open-account-submit-container">
                    <button
                      type="submit"
                      id="open_account_proceed_form"
                      className="register-user"
                    >
                      Get OTP
                      <div className="pulse-container">
                        <div className="pulse-bubble pulse-bubble-1"></div>
                        <div className="pulse-bubble pulse-bubble-2"></div>
                        <div className="pulse-bubble pulse-bubble-3"></div>
                        <div className="pulse-bubble pulse-bubble-4"></div>
                      </div>
                    </button>
                  </div>
                </form>

                <div className="acop-disclaimer text-12">
                  <span className="text-grey">
                    By proceeding, you agree to the Zerodha{' '}
                    <a href="https://zerodha.com/terms-and-conditions" target="_blank" rel="noreferrer">
                      terms
                    </a>{' '}
                    &amp;{' '}
                    <a href="https://zerodha.com/privacy-policy" target="_blank" rel="noreferrer">
                      privacy policy
                    </a>
                  </span>
                  <hr />
                  <span className="text-12">
                    Looking to open NRI account?{' '}
                    <a href="https://zerodha.com/open-account/nri/">Click here</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. INVESTMENT OPTIONS ───────────────────── */}
        <div className="account-open-sections">
          <div className="mini-container investment-options-section">
            <h2 className="text-center">Investment options with Zerodha demat account</h2>
            <div className="investment-options-group">
              {investmentOptions.map(opt => (
                <div className="investment-options" key={opt.title}>
                  <img src={opt.img} alt={opt.alt} />
                  <div>
                    <h3>{opt.title}</h3>
                    <p className="text-grey acop-steps-text">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center">
              <a href="https://zerodha.com/investments/" className="button space-top">
                Explore Investments
              </a>
            </p>
          </div>
        </div>

        {/* ── 4. STEPS ────────────────────────────────── */}
        <div className="account-open-sections acop-steps-section">
          <div className="mini-container">
            <h2 className="text-center">Steps to open a demat account with Zerodha</h2>
            <div className="account-open-steps">
              <div className="video-container-acop">
                <img
                  src="https://zerodha.com/static/images/steps-acop.svg"
                  alt="Steps to open a demat account"
                  id="video-trigger-acop"
                />
              </div>
              <div className="account-open-steps-num">
                {[
                  { num: '01', text: 'Enter the requested details' },
                  { num: '02', text: 'Complete e-sign & verification' },
                  { num: '03', text: 'Start investing!' },
                ].map(step => (
                  <div className="acop-steps-container" key={step.num}>
                    <div className="acop-steps text-center">{step.num}</div>
                    <p className="acop-steps-text">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. BENEFITS ─────────────────────────────── */}
        <div className="account-open-sections acop-benefits-section">
          <div className="container acop-benefits">
            <div className="row between v-align">
              <div className="six columns">
                <p className="text-center">
                  <img
                    src="https://zerodha.com/static/images/acop-benefits.svg"
                    alt="Benefits of Zerodha"
                  />
                </p>
                <h2>Benefits of opening a Zerodha demat account</h2>
              </div>
              <div className="six columns">
                <h3>Unbeatable pricing</h3>
                <p className="text-grey">
                  Zero charges for equity &amp; mutual fund investments. Flat ₹20 fees for intraday
                  and F&amp;O trades.
                </p>
                <br />
                <h3>Best investing experience</h3>
                <p className="text-grey">
                  Simple and intuitive trading platform with an easy-to-understand user interface.
                </p>
                <br />
                <h3>No spam or gimmicks</h3>
                <p className="text-grey">
                  Committed to transparency — no gimmicks, spam, &quot;gamification&quot;, or
                  intrusive push notifications.
                </p>
                <br />
                <h3>The Zerodha universe</h3>
                <p className="text-grey">
                  More than just an app — gain free access to the entire ecosystem of our partner
                  products.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. ACCOUNT TYPES ────────────────────────── */}
        <div className="account-open-sections account-types-section">
          <div className="container">
            <h2 className="text-center">Explore different account types</h2>

            {/* Row 1: Individual, HUF, NRI */}
            <div className="row between v-align">
              {accountTypes.slice(0, 3).map(type => (
                <div className="four columns" key={type.title}>
                  <a className="acop-type-card" href={type.href}>
                    <img src={type.img} alt={type.alt} />
                    <h3>{type.title}</h3>
                    <p className="text-grey">{type.desc}</p>
                  </a>
                </div>
              ))}
            </div>

            <br className="hide-on-mobile" />

            {/* Row 2: Minor, Corporate, empty */}
            <div className="row between v-align">
              {accountTypes.slice(3).map(type => (
                <div className="four columns" key={type.title}>
                  <a className="acop-type-card" href={type.href}>
                    <img src={type.img} alt={type.alt} />
                    <h3>{type.title}</h3>
                    <p className="text-grey">{type.desc}</p>
                  </a>
                </div>
              ))}
              {/* empty spacer */}
              <div className="four columns"></div>
            </div>
          </div>
        </div>

        {/* ── 7. FAQ ──────────────────────────────────── */}
        <div className="signup-faq-section">
          <div className="faq-container">
            <h3 className="faq-title">FAQs</h3>
            <div className="faq-list">
              {faqs.map(faq => (
                <details className="faq-item" key={faq.q}>
                  <summary className="faq-question">
                    <span className="question-text">{faq.q}</span>
                    <span className="icon-angle-down icon-down-dir"></span>
                  </summary>
                  <div className="faq-answer">
                    {faq.aHtml ? faq.aHtml : <p>{faq.a}</p>}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* ── 8. FOOTER CTA ───────────────────────────── */}
        <div className="account-open-sections acop-footer-section">
          <div className="container text-center">
            <h2>Open a Zerodha account</h2>
            <h3>Simple and intuitive apps · ₹0 for investments · ₹20 for intraday and F&amp;O trades.</h3>
            <div className="text-center">
              <a
                className="button"
                href="#"
                onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                Signup for free
              </a>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
