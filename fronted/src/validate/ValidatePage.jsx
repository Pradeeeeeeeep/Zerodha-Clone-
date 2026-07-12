import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoSvg from '../landingPage/assets/logo.svg';
import otpSvg from './assets/page-otp-DLrksP7J.svg';
import './ValidatePage.css';

const OTP_LENGTH = 6;

export default function ValidatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Phone number can be passed via navigation state from open-account page
  const phone = location.state?.phone || '9999999999';

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  // Cancel the global body padding-top that LandingPage.css sets for its fixed navbar.
  // We add a class to body and remove it on unmount.
  useEffect(() => {
    document.body.classList.add('no-nav-padding');
    return () => document.body.classList.remove('no-nav-padding');
  }, []);

  function handleChange(index, e) {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    const digit = val[val.length - 1];
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const next = [...otp];
        next[index] = '';
        setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = [...otp];
        next[index - 1] = '';
        setOtp(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  }

  function handleSubmit(e) {
    if (e) e.preventDefault();
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the complete OTP');
      return;
    }
    // Navigate to dashboard after successful OTP entry
    navigate('/dashboard');
  }

  const isComplete = otp.every(d => d !== '');

  return (
    <div className="validate-root">
      {/* TOP HEADER */}
      <header className="validate-header">
        <Link to="/" className="validate-logo-link">
          <img src={logoSvg} alt="Zerodha" className="validate-logo" />
        </Link>
        <div className="validate-user-icon" aria-label="User account">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="#387ed1" strokeWidth="1.5" fill="#e8f0fd" />
            <circle cx="12" cy="9" r="3.5" fill="#387ed1" />
            <path d="M5.5 19.5C5.5 16.46 8.46 14 12 14s6.5 2.46 6.5 5.5" stroke="#387ed1" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="validate-main">
        {/* Left: Illustration */}
        <div className="validate-illus">
          <img src={otpSvg} alt="OTP Illustration" />
        </div>

        {/* Right: OTP Form */}
        <div className="validate-form-side">
          <h1 className="validate-title">Mobile OTP</h1>
          <p className="validate-subtitle">
            Sent to +91 {phone}{' '}
            <Link to="/open-account" className="validate-change-link">(change)</Link>
          </p>

          <form onSubmit={handleSubmit} className="validate-form">
            {/* OTP Input Row */}
            <div className="validate-otp-wrapper">
              <div className="validate-otp-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="2" width="14" height="20" rx="2.5" stroke="#424242" strokeWidth="1.5" fill="none" />
                  <circle cx="12" cy="17.5" r="1" fill="#424242" />
                </svg>
              </div>
              <div className="validate-otp-inputs" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    className={`validate-otp-box${digit ? ' filled' : ''}`}
                    onChange={e => handleChange(i, e)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onFocus={e => e.target.select()}
                    autoFocus={i === 0}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {error && <p className="validate-error">{error}</p>}

            {/* Resend */}
            <div className="validate-resend">
              <span className="validate-resend-label">Didn't receive OTP?</span>
              <span>
                Resend via{' '}
                <button
                  type="button"
                  className="validate-resend-btn"
                  onClick={() => alert('OTP sent via SMS')}
                >
                  SMS
                </button>
                {' / '}
                <button
                  type="button"
                  className="validate-resend-btn"
                  onClick={() => alert('OTP sent via WhatsApp')}
                >
                  Whatsapp
                </button>
              </span>
            </div>
          </form>
        </div>
      </main>

      {/* STICKY FOOTER */}
      <footer className="validate-footer">
        <div className="validate-footer-divider" />
        <div className="validate-footer-inner">
          <button
            type="button"
            className={`validate-continue-btn${isComplete ? ' active' : ''}`}
            onClick={handleSubmit}
            disabled={!isComplete}
          >
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
}
