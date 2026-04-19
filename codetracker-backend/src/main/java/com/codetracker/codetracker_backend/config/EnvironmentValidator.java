package com.codetracker.codetracker_backend.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class EnvironmentValidator {

    private static final Logger log = LoggerFactory.getLogger(EnvironmentValidator.class);

    @Value("${spring.datasource.url:}")
    private String dbUrl;

    @Value("${spring.datasource.username:}")
    private String dbUsername;

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    @Value("${app.openai.api-key:}")
    private String openaiApiKey;

    @Value("${app.frontend-url:}")
    private String frontendUrl;

    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret:}")
    private String stripeWebhookSecret;

    @Value("${cors.allowed-origins:}")
    private String corsAllowedOrigins;

    @PostConstruct
    public void validate() {
        List<String> missing = new ArrayList<>();

        if (isBlank(dbUrl))              missing.add("DB_URL");
        if (isBlank(dbUsername))         missing.add("DB_USERNAME");
        if (isBlank(dbPassword))         missing.add("DB_PASSWORD");
        if (isBlank(jwtSecret))          missing.add("JWT_SECRET");
        if (isBlank(openaiApiKey))       missing.add("OPENAI_API_KEY");
        if (isBlank(frontendUrl))        missing.add("FRONTEND_URL");
        if (isBlank(stripeSecretKey))    missing.add("STRIPE_SECRET_KEY");
        if (isBlank(stripeWebhookSecret)) missing.add("STRIPE_WEBHOOK_SECRET");
        if (isBlank(corsAllowedOrigins)) missing.add("CORS_ALLOWED_ORIGINS");

        if (!missing.isEmpty()) {
            log.error("=================================================================");
            log.error("APPLICATION STARTUP FAILED — missing environment variables:");
            missing.forEach(var -> log.error("  ✗  {}", var));
            log.error("=================================================================");
            log.error("Set the above variables and restart the application.");
            throw new ApplicationContextException(
                "Missing required environment variables: " + String.join(", ", missing)
            );
        }

        log.info("Environment validation passed — all required variables are present.");
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
