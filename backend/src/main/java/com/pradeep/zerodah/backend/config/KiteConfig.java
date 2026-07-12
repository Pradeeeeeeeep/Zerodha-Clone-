package com.pradeep.zerodah.backend.config;

import com.zerodhatech.kiteconnect.KiteConnect;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configures the KiteConnect SDK bean.
 *
 * The api_key and api_secret come from application.properties.
 * The access_token must be generated daily via the /api/auth/login endpoint:
 *   1. Open the login URL in browser, login with Kite credentials
 *   2. Copy the request_token from the redirect URL
 *   3. POST to /api/auth/session?requestToken=XXX to get the access_token
 *
 * If access_token is still DEMO, ChartService returns mock candle data.
 */
@Configuration
public class KiteConfig {

    @Value("${kite.api.key}")
    private String apiKey;

    @Value("${kite.api.secret}")
    private String apiSecret;

    @Value("${kite.api.access.token:DEMO}")
    private String accessToken;

    @Bean
    public KiteConnect kiteConnect() {
        KiteConnect kiteConnect = new KiteConnect(apiKey);
        // Set access token if already provided (not DEMO)
        if (!accessToken.equals("DEMO")) {
            kiteConnect.setAccessToken(accessToken);
        }
        return kiteConnect;
    }

    @Bean
    public boolean isDemoMode() {
        return "DEMO".equals(accessToken);
    }

    public String getApiKey() { return apiKey; }
    public String getApiSecret() { return apiSecret; }
}
