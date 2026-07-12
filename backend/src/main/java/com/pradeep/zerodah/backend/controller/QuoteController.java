package com.pradeep.zerodah.backend.controller;

import com.pradeep.zerodah.backend.model.StockQuote;
import com.zerodhatech.kiteconnect.KiteConnect;
import com.zerodhatech.kiteconnect.kitehttp.exceptions.KiteException;
import com.zerodhatech.models.Quote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * REST controller for live stock quote data.
 *
 * Endpoint: GET /api/quotes?instruments=NSE:HDFCBANK,NSE:INFY,NSE:TCS,...
 *
 * Instruments must be in Kite format: EXCHANGE:SYMBOL
 * e.g. NSE:HDFCBANK, NSE:NIFTY 50, BSE:SENSEX
 *
 * Returns a map of { "NSE:HDFCBANK": { lastPrice, change, changePct, ... } }
 *
 * In demo/no-auth mode, returns simulated live prices with small random ticks
 * so the watchlist UI still looks alive for development.
 */
@RestController
@RequestMapping("/api/quotes")
@CrossOrigin(origins = "${cors.allowed.origin:http://localhost:5173}")
public class QuoteController {

    // Seed prices for demo mode — keyed by "EXCHANGE:SYMBOL"
    private static final Map<String, double[]> SEED_PRICES = Map.ofEntries(
        Map.entry("NSE:NIFTY 50",    new double[]{24200.0, 24180.0}),
        Map.entry("NSE:HDFCBANK",    new double[]{1600.0,  1595.0}),
        Map.entry("NSE:INFY",        new double[]{1068.0,  1051.0}),
        Map.entry("NSE:TCS",         new double[]{2069.0,  2047.0}),
        Map.entry("NSE:ONGC",        new double[]{244.96,  243.65}),
        Map.entry("NSE:HINDUNILVR",  new double[]{2149.0,  2143.0}),
        Map.entry("NSE:GOLDBEES",    new double[]{118.14,  118.42}),
        Map.entry("NSE:RELIANCE",    new double[]{2850.0,  2840.0}),
        Map.entry("NSE:BAJFINANCE",  new double[]{6800.0,  6750.0}),
        Map.entry("NSE:SBIN",        new double[]{820.0,   815.0}),
        Map.entry("NSE:WIPRO",       new double[]{490.0,   487.0}),
        Map.entry("NSE:AXISBANK",    new double[]{1175.0,  1168.0})
    );

    // Tracks last demo price per instrument for realistic walk
    private final ConcurrentHashMap<String, Double> demoPrices = new ConcurrentHashMap<>();

    private final KiteConnect kiteConnect;

    @Autowired
    public QuoteController(KiteConnect kiteConnect) {
        this.kiteConnect = kiteConnect;
    }

    /**
     * Returns live quotes for the specified instruments.
     *
     * @param instruments Comma-separated list of EXCHANGE:SYMBOL strings
     *                    e.g. "NSE:HDFCBANK,NSE:INFY,NSE:NIFTY 50"
     */
    @GetMapping
    public ResponseEntity<?> getQuotes(
            @RequestParam(defaultValue = "NSE:HDFCBANK,NSE:INFY,NSE:TCS,NSE:ONGC,NSE:HINDUNILVR,NSE:GOLDBEES")
            String instruments
    ) {
        String[] instArray = instruments.split(",");

        // Check if we have a valid access token
        boolean useMock = false;
        try {
            String token = kiteConnect.getAccessToken();
            useMock = (token == null || token.isBlank());
        } catch (NullPointerException e) {
            useMock = true;
        }

        if (useMock) {
            return ResponseEntity.ok(generateMockQuotes(instArray));
        }

        try {
            Map<String, Quote> raw = kiteConnect.getQuote(instArray);
            Map<String, StockQuote> result = new LinkedHashMap<>();

            for (String inst : instArray) {
                String key = inst.trim();
                Quote q = raw.get(key);
                if (q == null) continue;

                String[] parts = key.split(":", 2);
                String exchange = parts.length > 1 ? parts[0] : "NSE";
                String symbol   = parts.length > 1 ? parts[1] : key;

                double prevClose = q.ohlc != null ? q.ohlc.close : q.lastPrice;
                double change    = q.lastPrice - prevClose;
                double changePct = prevClose != 0 ? (change / prevClose) * 100 : 0;

                result.put(key, new StockQuote(
                        symbol, exchange,
                        round(q.lastPrice),
                        q.ohlc != null ? round(q.ohlc.open)  : 0,
                        q.ohlc != null ? round(q.ohlc.high)  : 0,
                        q.ohlc != null ? round(q.ohlc.low)   : 0,
                        prevClose != 0  ? round(prevClose)   : 0,
                        round(change),
                        round(changePct),
                        q.volumeTradedToday,
                        q.buyQuantity,
                        q.sellQuantity,
                        q.upperCircuitLimit,
                        q.lowerCircuitLimit
                ));
            }
            return ResponseEntity.ok(result);

        } catch (KiteException e) {
            // Fall back to mock on auth errors
            if (e.code == 403 || e.code == 401) {
                return ResponseEntity.ok(generateMockQuotes(instArray));
            }
            return ResponseEntity.status(503)
                    .body(Map.of("error", "Kite API error [" + e.code + "]: " + e.message));
        } catch (IOException e) {
            return ResponseEntity.status(503)
                    .body(Map.of("error", "Network error: " + e.getMessage()));
        }
    }

    // ── Mock quote generator ──────────────────────────────────────────────────

    private Map<String, StockQuote> generateMockQuotes(String[] instruments) {
        Map<String, StockQuote> result = new LinkedHashMap<>();
        Random rand = new Random();

        for (String inst : instruments) {
            String key = inst.trim();
            String[] parts = key.split(":", 2);
            String exchange = parts.length > 1 ? parts[0] : "NSE";
            String symbol   = parts.length > 1 ? parts[1] : key;

            // Get or initialise seed price
            double[] seeds  = SEED_PRICES.getOrDefault(key, new double[]{1000.0, 995.0});
            double prevClose = seeds[1];
            double lastPrice = demoPrices.compute(key, (k, prev) -> {
                if (prev == null) return seeds[0];
                // Random walk: ±0.25% per poll
                double tick = prev * 0.0025 * (rand.nextDouble() - 0.48);
                return round(prev + tick);
            });

            double change    = round(lastPrice - prevClose);
            double changePct = round((change / prevClose) * 100);
            double open      = round(prevClose * (1 + (rand.nextDouble() - 0.5) * 0.005));
            double high      = round(Math.max(lastPrice, open) * (1 + rand.nextDouble() * 0.003));
            double low       = round(Math.min(lastPrice, open) * (1 - rand.nextDouble() * 0.003));
            long   vol       = 1_000_000L + (long)(rand.nextDouble() * 5_000_000);

            result.put(key, new StockQuote(
                    symbol, exchange, lastPrice, open, high, low,
                    prevClose, change, changePct, vol, 0, 0, 0, 0
            ));
        }
        return result;
    }

    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
