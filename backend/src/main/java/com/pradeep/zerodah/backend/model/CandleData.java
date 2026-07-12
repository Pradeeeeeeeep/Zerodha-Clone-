package com.pradeep.zerodah.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Data Transfer Object representing a single OHLCV candlestick.
 * Maps to the Kite Connect Historical Data API response:
 * [timestamp, open, high, low, close, volume]
 */
public class CandleData {

    @JsonProperty("timestamp")
    private String timestamp;

    @JsonProperty("open")
    private double open;

    @JsonProperty("high")
    private double high;

    @JsonProperty("low")
    private double low;

    @JsonProperty("close")
    private double close;

    @JsonProperty("volume")
    private long volume;

    // Default constructor
    public CandleData() {}

    public CandleData(String timestamp, double open, double high, double low, double close, long volume) {
        this.timestamp = timestamp;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public double getOpen() { return open; }
    public void setOpen(double open) { this.open = open; }

    public double getHigh() { return high; }
    public void setHigh(double high) { this.high = high; }

    public double getLow() { return low; }
    public void setLow(double low) { this.low = low; }

    public double getClose() { return close; }
    public void setClose(double close) { this.close = close; }

    public long getVolume() { return volume; }
    public void setVolume(long volume) { this.volume = volume; }

    @Override
    public String toString() {
        return "CandleData{" +
                "timestamp='" + timestamp + '\'' +
                ", open=" + open +
                ", high=" + high +
                ", low=" + low +
                ", close=" + close +
                ", volume=" + volume +
                '}';
    }
}
