# Zerodha Kite Clone

A full-stack clone of the [Zerodha Kite](https://kite.zerodha.com) trading platform built with **Spring Boot** (backend) and **React + Vite** (frontend), integrated with the official [Kite Connect API](https://kite.trade/docs/connect/v3/) for live market data.

---

## ✨ Features

### 🏠 Landing Page
- Pixel-perfect Zerodha landing page clone
- Responsive navbar with smooth scroll
- Hero section, product ecosystem overview, education section
- Open account CTA flow

### 🔐 Authentication Flow
- OTP-based account verification page (`/validate`)
- After OTP entry, redirects to the trading dashboard
- Kite Connect OAuth login flow via `/api/auth/login-url`

### 📊 Trading Dashboard (`/dashboard`)
- **Live Watchlist** — real-time stock prices polled every 3 seconds
  - Price flash animation (🟢 green on rise, 🔴 red on fall)
  - Hover actions: Buy · Sell · Chart · More
  - LIVE / DEMO badge with pulsing indicator
- **Live Ticker Bar** — NIFTY 50 price updated in real time
- **Market Overview** — dynamic area chart from backend NIFTY 50 data
- **Charts Page** — full interactive candlestick charting
  - 7 interval options: 1m · 3m · 5m · 15m · 30m · 1H · Day
  - 5 date ranges: 1W · 1M · 3M · 6M · 1Y
  - Searchable instrument selector (NIFTY 50, HDFC, INFY, TCS, etc.)
  - Hover crosshair with OHLCV tooltip
  - Volume bars below price chart
  - OHLCV summary cards
- **Orders, Holdings, Positions, Funds pages**

### ⚙️ Backend REST API
| Endpoint | Description |
|----------|-------------|
| `GET /api/auth/login-url` | Returns Kite Connect OAuth login URL |
| `GET /api/auth/session?requestToken=XXX` | Generates access token from request token |
| `GET /api/auth/status` | Returns current auth status |
| `GET /api/quotes?instruments=NSE:HDFCBANK,...` | Live stock quotes (LTP, OHLC, change%) |
| `GET /api/chart/historical` | Historical OHLCV candle data |
| `GET /api/chart/instruments` | List of supported instrument tokens |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 4.1.0, Java 17 |
| Kite SDK | [javakiteconnect 4.0.0](https://github.com/zerodha/javakiteconnect) |
| Frontend | React 18, Vite 8 |
| Styling | Vanilla CSS (no Tailwind) |
| Charts | Pure SVG (no external chart library) |
| Routing | React Router DOM |
| Build | Maven (backend), npm (frontend) |

---

## 📁 Project Structure

```
Zerodha/
├── backend/                          # Spring Boot application
│   └── src/main/java/com/pradeep/zerodah/backend/
│       ├── BackendApplication.java
│       ├── config/
│       │   └── KiteConfig.java       # KiteConnect SDK bean
│       ├── controller/
│       │   ├── AuthController.java   # OAuth login flow
│       │   ├── ChartController.java  # Historical candle data
│       │   └── QuoteController.java  # Live stock quotes
│       ├── model/
│       │   ├── CandleData.java       # OHLCV DTO
│       │   └── StockQuote.java       # Quote DTO
│       └── service/
│           └── ChartService.java     # Business logic (live/mock)
│
└── fronted/                          # React application
    └── src/
        ├── App.jsx                   # Router config
        ├── landingPage/              # Landing page components
        ├── open-account/             # Account opening flow
        ├── validate/
        │   └── ValidatePage.jsx      # OTP verification → redirects to /dashboard
        └── dashboard/
            ├── KiteDashboard.jsx     # Main shell (watchlist + nav + live prices)
            ├── KiteDashboard.css
            └── pages/
                ├── DashboardHome.jsx # Market overview + gainers/losers + IPOs
                ├── ChartsPage.jsx    # Candlestick chart
                ├── OrdersPage.jsx
                ├── HoldingsPage.jsx
                ├── PositionsPage.jsx
                └── FundsPage.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven (or use the included `mvnw` wrapper)
- Node.js 18+ and npm
- A [Kite Connect](https://kite.trade) developer account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/Pradeeeeeeeep/Zerodha-Clone-
cd Zerodha-Clone-
```

### 2. Configure Backend

Edit `backend/src/main/resources/application.properties`:
```properties
kite.api.key=YOUR_API_KEY
kite.api.secret=YOUR_API_SECRET
kite.api.access.token=DEMO
cors.allowed.origin=http://localhost:5173
```

> **DEMO mode**: Keep `access.token=DEMO` to run with simulated market data — no Kite subscription needed. The mock data uses realistic random-walk pricing seeded per stock.

### 3. Start the Backend
```bash
cd backend
./mvnw spring-boot:run
# Server starts at http://localhost:8080
```

### 4. Start the Frontend
```bash
cd fronted
npm install
npm run dev
# App starts at http://localhost:5173
```

---

## 🔑 Connecting Live Market Data

The Kite Connect access token expires daily. Follow these steps each day to activate live data:

**Step 1** — Get your login URL:
```
GET http://localhost:8080/api/auth/login-url
```

**Step 2** — Open the returned URL in your browser and log in with your Zerodha credentials. After login, you'll be redirected to a URL like:
```
http://127.0.0.1/?request_token=XXXXXXXXXX&action=login&status=success
```
Copy the `request_token` value.

**Step 3** — Exchange for access token:
```
GET http://localhost:8080/api/auth/session?requestToken=XXXXXXXXXX
```

Live market data starts immediately — **no restart needed**.

---

## 📡 API Reference

### Quote Endpoint
```
GET /api/quotes?instruments=NSE:HDFCBANK,NSE:INFY,NSE:TCS
```
**Response:**
```json
{
  "NSE:HDFCBANK": {
    "symbol": "HDFCBANK",
    "exchange": "NSE",
    "lastPrice": 1602.07,
    "open": 1591.77,
    "high": 1606.40,
    "low": 1590.33,
    "close": 1595.00,
    "change": 7.07,
    "changePct": 0.44,
    "volume": 3301452
  }
}
```

### Historical Candles Endpoint
```
GET /api/chart/historical
  ?instrumentToken=256265
  &interval=day
  &from=2024-01-01
  &to=2024-06-30
```
**Supported intervals:** `minute` · `3minute` · `5minute` · `10minute` · `15minute` · `30minute` · `60minute` · `day`

**Response:**
```json
[
  {
    "timestamp": "2024-01-01T09:15:00",
    "open": 21711.00,
    "high": 21813.80,
    "low": 21670.45,
    "close": 21742.90,
    "volume": 138420000
  }
]
```

---

## 🖥️ Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `LandingPage` | Zerodha marketing landing page |
| `/open-account` | `OpenAccountPage` | Multi-step account opening form |
| `/validate` | `ValidatePage` | OTP verification (redirects to dashboard) |
| `/dashboard` | `KiteDashboard` | Full trading dashboard |

---

## 🎨 Design Highlights

- **No CSS frameworks** — pure vanilla CSS with custom design system
- **No chart libraries** — candlestick charts built entirely with SVG
- **Micro-animations** — price flash, pulsing live dot, loading shimmer, hover transitions
- **Dark-themed Charts page**, light-themed Dashboard (matches Kite Zerodha design)
- Responsive watchlist with keyboard-friendly OTP input

---

## 📝 Notes

- This is a **UI clone for learning purposes** and is not affiliated with Zerodha
- Historical data API access requires Kite Connect subscription (₹2000/month or free for self-use)
- The DEMO mode generates realistic simulated data for all stocks without any API key
- Access tokens expire at **midnight IST** daily and must be regenerated

---

## 📄 License

MIT
