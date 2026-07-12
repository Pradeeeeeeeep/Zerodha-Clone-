package com.pradeep.zerodah.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO for live stock quote data returned to the frontend watchlist.
 */
public class StockQuote {

    @JsonProperty("symbol")
    private String symbol;

    @JsonProperty("exchange")
    private String exchange;

    @JsonProperty("lastPrice")
    private double lastPrice;

    @JsonProperty("open")
    private double open;

    @JsonProperty("high")
    private double high;

    @JsonProperty("low")
    private double low;

    @JsonProperty("close")
    private double close;

    @JsonProperty("change")
    private double change;

    @JsonProperty("changePct")
    private double changePct;

    @JsonProperty("volume")
    private double volume;

    @JsonProperty("buyQuantity")
    private double buyQuantity;

    @JsonProperty("sellQuantity")
    private double sellQuantity;

    @JsonProperty("upperCircuitLimit")
    private double upperCircuitLimit;

    @JsonProperty("lowerCircuitLimit")
    private double lowerCircuitLimit;

    public StockQuote() {}

    public StockQuote(String symbol, String exchange, double lastPrice, double open,
                      double high, double low, double close, double change, double changePct,
                      double volume, double buyQuantity, double sellQuantity,
                      double upperCircuitLimit, double lowerCircuitLimit) {
        this.symbol = symbol;
        this.exchange = exchange;
        this.lastPrice = lastPrice;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.change = change;
        this.changePct = changePct;
        this.volume = volume;
        this.buyQuantity = buyQuantity;
        this.sellQuantity = sellQuantity;
        this.upperCircuitLimit = upperCircuitLimit;
        this.lowerCircuitLimit = lowerCircuitLimit;
    }

    // ── Getters & Setters ─────────────────────────────────────────────────
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getExchange() { return exchange; }
    public void setExchange(String exchange) { this.exchange = exchange; }

    public double getLastPrice() { return lastPrice; }
    public void setLastPrice(double lastPrice) { this.lastPrice = lastPrice; }

    public double getOpen() { return open; }
    public void setOpen(double open) { this.open = open; }

    public double getHigh() { return high; }
    public void setHigh(double high) { this.high = high; }

    public double getLow() { return low; }
    public void setLow(double low) { this.low = low; }

    public double getClose() { return close; }
    public void setClose(double close) { this.close = close; }

    public double getChange() { return change; }
    public void setChange(double change) { this.change = change; }

    public double getChangePct() { return changePct; }
    public void setChangePct(double changePct) { this.changePct = changePct; }

    public double getVolume() { return volume; }
    public void setVolume(double volume) { this.volume = volume; }

    public double getBuyQuantity() { return buyQuantity; }
    public void setBuyQuantity(double buyQuantity) { this.buyQuantity = buyQuantity; }

    public double getSellQuantity() { return sellQuantity; }
    public void setSellQuantity(double sellQuantity) { this.sellQuantity = sellQuantity; }

    public double getUpperCircuitLimit() { return upperCircuitLimit; }
    public void setUpperCircuitLimit(double upperCircuitLimit) { this.upperCircuitLimit = upperCircuitLimit; }

    public double getLowerCircuitLimit() { return lowerCircuitLimit; }
    public void setLowerCircuitLimit(double lowerCircuitLimit) { this.lowerCircuitLimit = lowerCircuitLimit; }
}
