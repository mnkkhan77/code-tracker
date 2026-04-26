package com.codetracker.codetracker_backend.controller.payment;

import com.codetracker.codetracker_backend.constants.PurchaseStatusConstants;
import com.codetracker.codetracker_backend.dto.CheckoutRequestDto;
import com.codetracker.codetracker_backend.dto.CheckoutResponseDto;
import com.codetracker.codetracker_backend.entity.Purchase;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.repository.PurchaseRepository;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Tag(name = "Payments", description = "Stripe payment and webhook handling")
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class StripePaymentController {

    private final PurchaseRepository purchaseRepository;
    private final UserRepository userRepository;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    // Price in cents
    private static final Map<String, Long> PRODUCT_PRICES_CENTS = Map.of(
            "SUBSCRIPTION",    999L,
            "RESUME_ANALYSIS", 499L,
            "CREDITS",         1499L,
            "CREDITS_SMALL",   500L,
            "CREDITS_MEDIUM",  1000L,
            "CREDITS_LARGE",   2000L
    );

    // Credits granted per product type (only for credit packs)
    private static final Map<String, Integer> CREDITS_AMOUNTS = Map.of(
            "CREDITS",        100,
            "CREDITS_SMALL",  10,
            "CREDITS_MEDIUM", 20,
            "CREDITS_LARGE",  35
    );

    private static final Map<String, String> PRODUCT_NAMES = Map.of(
            "SUBSCRIPTION",    "Premium Subscription",
            "RESUME_ANALYSIS", "Resume Analysis",
            "CREDITS",         "Credits Pack (100 credits)",
            "CREDITS_SMALL",   "Starter Credits (10 credits)",
            "CREDITS_MEDIUM",  "Professional Credits (20 credits)",
            "CREDITS_LARGE",   "Premium Credits (35 credits)"
    );

    private static final Map<String, String> PRODUCT_DESCRIPTIONS = Map.of(
            "SUBSCRIPTION",    "Monthly access to all premium features",
            "RESUME_ANALYSIS", "AI-powered resume review and scoring",
            "CREDITS",         "100 platform credits for enhanced features",
            "CREDITS_SMALL",   "10 credits — perfect for trying out the ATS checker",
            "CREDITS_MEDIUM",  "20 credits — most popular for job seekers",
            "CREDITS_LARGE",   "35 credits — best value for multiple resumes"
    );

    @Operation(summary = "Create a Stripe checkout session")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Checkout URL returned"),
        @ApiResponse(responseCode = "400", description = "Invalid product type")
    })
    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDto> createCheckoutSession(
            @Valid @RequestBody CheckoutRequestDto request,
            Authentication auth) throws StripeException {

        String productType = request.getProductType().toUpperCase();
        if (!PRODUCT_PRICES_CENTS.containsKey(productType)) {
            return ResponseEntity.badRequest().build();
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setProductType(productType);
        purchase.setAmount(BigDecimal.valueOf(PRODUCT_PRICES_CENTS.get(productType), 2));
        purchase.setCurrency("USD");
        purchase.setStatus("PENDING");
        purchase = purchaseRepository.save(purchase);

        Stripe.apiKey = stripeSecretKey;

        // Credit purchases redirect back to the ATS checker after success
        String successUrl = frontendUrl + "/payment/success?session_id={CHECKOUT_SESSION_ID}";
        if (CREDITS_AMOUNTS.containsKey(productType)) {
            successUrl += "&from=ats";
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(frontendUrl + "/payment/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(PRODUCT_PRICES_CENTS.get(productType))
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(PRODUCT_NAMES.get(productType))
                                                                .setDescription(PRODUCT_DESCRIPTIONS.get(productType))
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .putMetadata("purchaseId", purchase.getId().toString())
                .putMetadata("userId", user.getId().toString())
                .build();

        Session session = Session.create(params);
        purchase.setProviderRef(session.getId());
        purchaseRepository.save(purchase);

        return ResponseEntity.ok(new CheckoutResponseDto(session.getUrl(), purchase.getId().toString()));
    }

    @Operation(summary = "Handle Stripe webhook events")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Event processed"),
        @ApiResponse(responseCode = "400", description = "Invalid signature")
    })
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(HttpServletRequest request) throws IOException {
        byte[] payload = request.getInputStream().readAllBytes();
        String sigHeader = request.getHeader("Stripe-Signature");

        Event event;
        try {
            event = Webhook.constructEvent(new String(payload), sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.warn("Stripe webhook signature verification failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        log.info("Stripe webhook received: {}", event.getType());

        switch (event.getType()) {
            case "checkout.session.completed" -> {
                Map<String, String> meta = extractMetadata(event);
                if (meta != null) {
                    completePurchase(meta.get("purchaseId"), meta.get("userId"));
                } else {
                    log.warn("checkout.session.completed: could not extract metadata (event={})", event.getId());
                }
            }
            case "checkout.session.expired" -> {
                Map<String, String> meta = extractMetadata(event);
                if (meta != null) {
                    failPurchase(meta.get("purchaseId"));
                }
            }
            case "payment_intent.payment_failed" ->
                log.warn("Payment failed event received: {}", event.getId());
            default -> log.debug("Unhandled Stripe event: {}", event.getType());
        }

        return ResponseEntity.ok("received");
    }

    /**
     * Extracts the session metadata map from a Stripe event.
     * Falls back to raw JSON parsing when the SDK version doesn't match the
     * webhook API version, which would cause getDataObjectDeserializer() to
     * return Optional.empty() even for a valid event.
     */
    private Map<String, String> extractMetadata(Event event) {
        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();

        // Happy path: SDK version matches webhook API version
        if (deserializer.getObject().isPresent()) {
            Session session = (Session) deserializer.getObject().get();
            return session.getMetadata();
        }

        // Fallback: parse metadata directly from the raw JSON payload
        try {
            String rawJson = deserializer.getRawJson();
            JsonNode obj = new ObjectMapper().readTree(rawJson);
            JsonNode metaNode = obj.get("metadata");
            if (metaNode == null || metaNode.isNull()) return null;
            Map<String, String> meta = new java.util.HashMap<>();
            metaNode.properties().forEach(e -> meta.put(e.getKey(), e.getValue().asText()));
            log.info("Extracted metadata via raw JSON fallback for event {}", event.getId());
            return meta;
        } catch (Exception e) {
            log.error("Failed to extract metadata from Stripe event {}: {}", event.getId(), e.getMessage());
            return null;
        }
    }

    private void completePurchase(String purchaseId, String userId) {
        if (purchaseId == null) return;
        purchaseRepository.findById(Objects.requireNonNull(UUID.fromString(purchaseId))).ifPresent(purchase -> {
            if (PurchaseStatusConstants.COMPLETED.equals(purchase.getStatus())) {
                log.warn("Purchase {} already completed, skipping duplicate webhook", purchaseId);
                return;
            }
            purchase.setStatus(PurchaseStatusConstants.COMPLETED);
            purchase.setPaidAt(LocalDateTime.now());
            purchaseRepository.save(purchase);
            log.info("Purchase {} completed (type={})", purchaseId, purchase.getProductType());

            Integer creditsToAdd = CREDITS_AMOUNTS.get(purchase.getProductType());
            if (creditsToAdd != null && userId != null) {
                userRepository.findById(Objects.requireNonNull(UUID.fromString(userId))).ifPresent(user -> {
                    user.setCredits(user.getCredits() + creditsToAdd);
                    userRepository.save(user);
                    log.info("Granted {} credits to user {} (type={})", creditsToAdd, userId, purchase.getProductType());
                });
            }
        });
    }

    private void failPurchase(String purchaseId) {
        if (purchaseId == null) return;
        purchaseRepository.findById(Objects.requireNonNull(UUID.fromString(purchaseId))).ifPresent(purchase -> {
            if (PurchaseStatusConstants.COMPLETED.equals(purchase.getStatus())) return;
            purchase.setStatus("FAILED");
            purchaseRepository.save(purchase);
            log.info("Purchase {} marked FAILED", purchaseId);
        });
    }
}
