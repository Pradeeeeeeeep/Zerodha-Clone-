package com.pradeep.zerodah.backend.service;

import com.pradeep.zerodah.backend.model.CandleData;
import com.zerodhatech.kiteconnect.KiteConnect;
import com.zerodhatech.kiteconnect.kitehttp.exceptions.KiteException;
import com.zerodhatech.models.HistoricalData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * Service to fetch historical candle data from the Kite Connect API.
 *
 * In DEMO mode (api.key=DEMO), realistic mock OHLCV data is returned so the
 * UI works perfectly for development without real credentials.
 *
 * In LIVE mode, the actual Kite Connect getHistoricalData() method is called.
 */
@Service
public class ChartService {

    private final KiteConnect kiteConnect;
    private final boolean demoMode;

    @Autowired
    public ChartService(KiteConnect kiteConnect, boolean isDemoMode) {
        this.kiteConnect = kiteConnect;
        this.demoMode = isDemoMode;
    }

    /**
     * Fetches OHLCV candles for the given instrument token and interval.
     *
     * @param instrumentToken Numeric instrument token (e.g. 256265 for NIFTY 50 index)
     * @param interval        Candle interval: minute, 3minute, 5minute, 10minute, 15minute, 30minute, 60minute, day
     * @param from            Start date in format yyyy-MM-dd HH:mm:ss (e.g. "2024-01-01 09:15:00")
     * @param to              End date  in format yyyy-MM-dd HH:mm:ss (e.g. "2024-01-31 15:30:00")
     * @param continuous      Pass true for continuous futures data
     * @param oi              Pass true to include Open Interest field
     * @return List of CandleData objects
     */
    public List<CandleData> getHistoricalData(
            long instrumentToken,
            String interval,
            String from,
            String to,
            boolean continuous,
            boolean oi
    ) {
        // Check at call time: if no access token is set yet, use mock data
        boolean useMock = demoMode;
        if (!useMock) {
            try {
                String token = kiteConnect.getAccessToken();
                useMock = (token == null || token.isBlank());
            } catch (NullPointerException e) {
                useMock = true;
            }
        }
        if (useMock) {
            return generateMockData(instrumentToken, interval, from, to);
        }

        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date fromDate = sdf.parse(from);
            Date toDate = sdf.parse(to);

            HistoricalData historicalData = kiteConnect.getHistoricalData(
                    fromDate,
                    toDate,
                    String.valueOf(instrumentToken),
                    interval,
                    continuous,
                    oi
            );

            List<CandleData> result = new ArrayList<>();
            if (historicalData != null && historicalData.dataArrayList != null) {
                SimpleDateFormat outFmt = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
                for (HistoricalData candle : historicalData.dataArrayList) {
                    result.add(new CandleData(
                            candle.timeStamp != null ? outFmt.format(candle.timeStamp) : "",
                            candle.open,
                            candle.high,
                            candle.low,
                            candle.close,
                            (long) candle.volume
                    ));
                }
            }
            return result;

        } catch (KiteException e) {
            throw new RuntimeException("Kite API error [" + e.code + "]: " + e.message, e);
        } catch (IOException e) {
            throw new RuntimeException("Network error communicating with Kite API: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch historical data: " + e.getMessage(), e);
        }
    }

    // ── Mock Data Generator ─────────────────────────────────────────────────

    /**
     * Generates realistic-looking OHLCV candle data for demo/development mode.
     * Simulates a stock price walk based on the instrument token as seed.
     */
    private List<CandleData> generateMockData(long instrumentToken, String interval, String from, String to) {
        List<CandleData> candles = new ArrayList<>();
        Random rand = new Random(instrumentToken);

        // Pick a starting price based on token (makes different stocks look different)
        double basePrice = 18000 + (instrumentToken % 10000);
        if (instrumentToken == 256265) basePrice = 24200; // NIFTY 50
        if (instrumentToken == 265)    basePrice = 80500; // SENSEX
        if (instrumentToken == 408065) basePrice = 1600;  // HDFCBANK
        if (instrumentToken == 341249) basePrice = 1050;  // INFY

        // Parse date range
        DateTimeFormatter dayFmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter dtFmt  = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        DateTimeFormatter outFmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss+0530");

        LocalDateTime start, end;
        try {
            if (from.length() == 10) {
                start = LocalDate.parse(from, dayFmt).atTime(9, 15);
                end   = LocalDate.parse(to,   dayFmt).atTime(15, 30);
            } else {
                start = LocalDateTime.parse(from, dtFmt);
                end   = LocalDateTime.parse(to,   dtFmt);
            }
        } catch (Exception e) {
            start = LocalDateTime.now().minusDays(60).withHour(9).withMinute(15);
            end   = LocalDateTime.now().withHour(15).withMinute(30);
        }

        // Determine step size from interval
        int stepMinutes = intervalToMinutes(interval);

        LocalDateTime current = start;
        double price = basePrice;

        while (!current.isAfter(end)) {
            // Skip non-trading hours for intraday intervals
            if (stepMinutes < 1440) {
                int hour = current.getHour();
                int minute = current.getMinute();
                if (hour < 9 || (hour == 9 && minute < 15) || hour >= 15 || (hour == 15 && minute > 30)) {
                    current = current.plusMinutes(stepMinutes);
                    continue;
                }
                // Skip weekends
                int dow = current.getDayOfWeek().getValue();
                if (dow == 6 || dow == 7) {
                    current = current.plusMinutes(stepMinutes);
                    continue;
                }
            } else {
                // Daily — skip weekends
                int dow = current.getDayOfWeek().getValue();
                if (dow == 6 || dow == 7) {
                    current = current.plusDays(1);
                    continue;
                }
            }

            // Simulate price movement
            double volatility = basePrice * 0.008;
            double change = (rand.nextDouble() - 0.48) * volatility;
            double open  = price;
            double close = price + change;
            double high  = Math.max(open, close) + rand.nextDouble() * volatility * 0.5;
            double low   = Math.min(open, close) - rand.nextDouble() * volatility * 0.5;
            long   vol   = (long)(500_000 + rand.nextInt(2_000_000));

            // Keep price positive
            if (close < 10) close = 10;
            if (low < 1) low = 1;

            candles.add(new CandleData(
                    current.format(outFmt),
                    round(open), round(high), round(low), round(close), vol
            ));

            price = close;
            if (stepMinutes >= 1440) {
                current = current.plusDays(1);
            } else {
                current = current.plusMinutes(stepMinutes);
            }
        }

        return candles;
    }

    private int intervalToMinutes(String interval) {
        return switch (interval) {
            case "minute"   -> 1;
            case "3minute"  -> 3;
            case "5minute"  -> 5;
            case "10minute" -> 10;
            case "15minute" -> 15;
            case "30minute" -> 30;
            case "60minute" -> 60;
            default         -> 1440; // "day"
        };
    }

    private double round(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}
