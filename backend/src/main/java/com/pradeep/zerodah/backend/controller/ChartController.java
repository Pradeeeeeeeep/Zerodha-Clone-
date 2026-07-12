package com.pradeep.zerodah.backend.controller;

import com.pradeep.zerodah.backend.model.CandleData;
import com.pradeep.zerodah.backend.service.ChartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * REST controller for chart / historical candle data.
 *
 * Endpoint: GET /api/chart/historical
 *
 * Query params:
 *   instrumentToken  long    (default: 256265 = NIFTY 50 index)
 *   interval         String  (minute | 3minute | 5minute | 10minute | 15minute | 30minute | 60minute | day)
 *   from             String  yyyy-MM-dd or yyyy-MM-dd HH:mm:ss  (default: 60 days ago)
 *   to               String  yyyy-MM-dd or yyyy-MM-dd HH:mm:ss  (default: today)
 *   continuous       boolean (default: false)
 *   oi               boolean (default: false)
 */
@RestController
@RequestMapping("/api/chart")
@CrossOrigin(origins = "${cors.allowed.origin:http://localhost:5173}")
public class ChartController {

    private final ChartService chartService;

    @Autowired
    public ChartController(ChartService chartService) {
        this.chartService = chartService;
    }

    /**
     * Fetch historical OHLCV candle data.
     */
    @GetMapping("/historical")
    public ResponseEntity<?> getHistoricalData(
            @RequestParam(defaultValue = "256265") long instrumentToken,
            @RequestParam(defaultValue = "day")    String interval,
            @RequestParam(required = false)        String from,
            @RequestParam(required = false)        String to,
            @RequestParam(defaultValue = "false")  boolean continuous,
            @RequestParam(defaultValue = "false")  boolean oi
    ) {
        try {
            // Default date range: last 60 days
            if (from == null || from.isBlank()) {
                from = LocalDate.now().minusDays(60).toString() + " 09:15:00";
            } else if (from.length() == 10) {
                from = from + " 09:15:00";
            }
            if (to == null || to.isBlank()) {
                to = LocalDate.now().toString() + " 15:30:00";
            } else if (to.length() == 10) {
                to = to + " 15:30:00";
            }

            List<CandleData> candles = chartService.getHistoricalData(
                    instrumentToken, interval, from, to, continuous, oi
            );
            return ResponseEntity.ok(candles);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(503)
                    .body(Map.of(
                            "error", "Failed to fetch chart data",
                            "message", e.getMessage()
                    ));
        }
    }

    /**
     * Returns the list of popular instruments with their token numbers.
     * The frontend uses this to populate the stock selector.
     */
    @GetMapping("/instruments")
    public ResponseEntity<List<Map<String, Object>>> getInstruments() {
        List<Map<String, Object>> instruments = List.of(
            Map.of("token", 256265,  "symbol", "NIFTY 50",    "exchange", "NSE", "name", "Nifty 50 Index"),
            Map.of("token", 265,     "symbol", "SENSEX",      "exchange", "BSE", "name", "BSE Sensex"),
            Map.of("token", 408065,  "symbol", "HDFCBANK",    "exchange", "NSE", "name", "HDFC Bank"),
            Map.of("token", 341249,  "symbol", "INFY",        "exchange", "NSE", "name", "Infosys"),
            Map.of("token", 2953217, "symbol", "TCS",         "exchange", "NSE", "name", "Tata Consultancy Services"),
            Map.of("token", 633601,  "symbol", "ONGC",        "exchange", "NSE", "name", "Oil & Natural Gas Corp"),
            Map.of("token", 356865,  "symbol", "HINDUNILVR",  "exchange", "NSE", "name", "Hindustan Unilever"),
            Map.of("token", 54,      "symbol", "RELIANCE",    "exchange", "NSE", "name", "Reliance Industries"),
            Map.of("token", 897537,  "symbol", "BAJFINANCE",  "exchange", "NSE", "name", "Bajaj Finance"),
            Map.of("token", 1270529, "symbol", "SBIN",        "exchange", "NSE", "name", "State Bank of India"),
            Map.of("token", 3861249, "symbol", "WIPRO",       "exchange", "NSE", "name", "Wipro"),
            Map.of("token", 325889,  "symbol", "AXISBANK",    "exchange", "NSE", "name", "Axis Bank")
        );
        return ResponseEntity.ok(instruments);
    }
}
