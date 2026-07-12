package com.pradeep.zerodah.backend.controller;

import com.pradeep.zerodah.backend.config.KiteConfig;
import com.zerodhatech.kiteconnect.KiteConnect;
import com.zerodhatech.kiteconnect.kitehttp.exceptions.KiteException;
import com.zerodhatech.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

/**
 * Handles Kite Connect authentication flow.
 *
 * HOW TO USE:
 * ──────────────────────────────────────────────────────
 * Step 1: GET /api/auth/login-url
 *         → Returns the Zerodha Kite login URL.
 *           Open it in a browser, log in with your Zerodha credentials.
 *           After login, you are redirected to your redirect URL with
 *           ?request_token=XXXX in the query string.
 *
 * Step 2: GET /api/auth/session?requestToken=XXXX
 *         → Exchanges the request_token for an access_token using your api_secret.
 *           Returns the access_token and user details.
 *           The access_token is stored in memory and used for all subsequent API calls.
 *           Access tokens expire at midnight IST.
 * ──────────────────────────────────────────────────────
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${cors.allowed.origin:http://localhost:5173}")
public class AuthController {

    private final KiteConnect kiteConnect;
    private final KiteConfig kiteConfig;

    // Holds the current session — updated when /session is called
    private volatile String currentAccessToken = null;
    private volatile String currentUserId = null;

    @Autowired
    public AuthController(KiteConnect kiteConnect, KiteConfig kiteConfig) {
        this.kiteConnect = kiteConnect;
        this.kiteConfig  = kiteConfig;
    }

    /**
     * Returns the Kite login URL. Open this in a browser to start the login flow.
     * After login, Zerodha redirects to your redirect URL with ?request_token=XXX
     */
    @GetMapping("/login-url")
    public ResponseEntity<Map<String, String>> getLoginUrl() {
        String loginUrl = kiteConnect.getLoginURL();
        return ResponseEntity.ok(Map.of(
            "loginUrl", loginUrl,
            "instructions", "1. Open this URL in your browser. 2. Log in with your Zerodha credentials. " +
                "3. After login, copy the 'request_token' from the redirect URL. " +
                "4. Call GET /api/auth/session?requestToken=YOUR_TOKEN"
        ));
    }

    /**
     * Exchanges a request_token for an access_token and stores it in the session.
     *
     * @param requestToken The request_token from the Kite login redirect URL
     */
    @GetMapping("/session")
    public ResponseEntity<?> generateSession(@RequestParam String requestToken) {
        try {
            User user = kiteConnect.generateSession(requestToken, kiteConfig.getApiSecret());

            if (user == null || user.accessToken == null) {
                return ResponseEntity.status(500)
                        .body(Map.of("error", "Session generation returned empty response"));
            }

            // Store access token and set it on the KiteConnect instance
            this.currentAccessToken = user.accessToken;
            this.currentUserId      = user.userId;
            kiteConnect.setAccessToken(user.accessToken);
            kiteConnect.setPublicToken(user.publicToken);

            return ResponseEntity.ok(Map.of(
                "status",      "success",
                "userId",      user.userId,
                "accessToken", user.accessToken,
                "publicToken", user.publicToken,
                "loginTime",   user.loginTime != null ? user.loginTime.toString() : "N/A",
                "message",     "Access token generated successfully! It will expire at midnight IST. " +
                               "You can now use the chart API with live data."
            ));

        } catch (KiteException e) {
            return ResponseEntity.status(400)
                    .body(Map.of(
                        "error",   "Kite API error [" + e.code + "]",
                        "message", e.message
                    ));
        } catch (IOException e) {
            return ResponseEntity.status(503)
                    .body(Map.of(
                        "error",   "Network error",
                        "message", e.getMessage()
                    ));
        }
    }

    /**
     * Returns the current auth status — whether a valid session is active.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        boolean hasToken = currentAccessToken != null;
        return ResponseEntity.ok(Map.of(
            "authenticated", hasToken,
            "userId",       currentUserId != null ? currentUserId : "Not logged in",
            "demoMode",     !hasToken,
            "loginUrl",     kiteConnect.getLoginURL()
        ));
    }
}
