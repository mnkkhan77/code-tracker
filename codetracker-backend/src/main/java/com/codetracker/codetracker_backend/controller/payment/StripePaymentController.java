package com.codetracker.codetracker_backend.controller.payment;

import com.codetracker.codetracker_backend.dto.CheckoutRequestDto;
import com.codetracker.codetracker_backend.dto.CheckoutResponseDto;
import com.codetracker.codetracker_backend.entity.Purchase;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.repository.PurchaseRepository;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    private static final Map<String, Long> PRODUCT_PRICES_CENTS = Map.of(
            "SUBSCRIPTION",    999L,   // $9.99
            "RESUME_ANALYSIS", 499L,   // $4.99
            "CREDITS",         1499L   // $14.99
    );

    private static final Map<String, String> PRODUCT_NAMES = Map.of(
            "SUBSCRIPTION",    "Premium Subscription",
            "RESUME_ANALYSIS", "Resume Analysis",
            "CREDITS",         "Credits Pack (100 credits)"
    );

    private static final Map<String, String> PRODUCT_DESCRIPTIONS = Map.of(
            "SUBSCRIPTION",    "Monthly access to all premium features",
            "RESUME_ANALYSIS", "AI-powered resume review and scoring",
            "CREDITS",         "100 platform credits for enhanced features"
    );

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

        // Create a PENDING purchase record
        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setProductType(productType);
        purchase.setAmount(BigDecimal.valueOf(PRODUCT_PRICES_CENTS.get(productType), 2));
        purchase.setCurrency("USD");
        purchase.setStatus("PENDING");
        purchase = purchaseRepository.save(purchase);

        // Create Stripe checkout session
        Stripe.apiKey = stripeSecretKey;

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/payment/success?session_id={CHECKOUT_SESSION_ID}")
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

        // Store session ID as provider reference
        purchase.setProviderRef(session.getId());
        purchaseRepository.save(purchase);

        return ResponseEntity.ok(new CheckoutResponseDto(session.getUrl(), purchase.getId().toString()));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(HttpServletRequest request) throws IOException {
        byte[] payload = request.getInputStream().readAllBytes();
        String sigHeader = request.getHeader("Stripe-Signature");

        Event event;
        try {
            event = Webhook.constructEvent(new String(payload), sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        switch (event.getType()) {
            case "checkout.session.completed" -> {
                Session session = (Session) event.getDataObjectDeserializer()
                        .getObject().orElse(null);
                if (session != null) {
                    completePurchase(session.getMetadata().get("purchaseId"));
                }
            }
            case "checkout.session.expired" -> {
                Session session = (Session) event.getDataObjectDeserializer()
                        .getObject().orElse(null);
                if (session != null) {
                    failPurchase(session.getMetadata().get("purchaseId"));
                }
            }
        }

        return ResponseEntity.ok("received");
    }

    private void completePurchase(String purchaseId) {
        if (purchaseId == null) return;
        purchaseRepository.findById(Objects.requireNonNull(UUID.fromString(purchaseId))).ifPresent(purchase -> {
            purchase.setStatus("COMPLETED");
            purchase.setPaidAt(LocalDateTime.now());
            purchaseRepository.save(purchase);
        });
    }

    private void failPurchase(String purchaseId) {
        if (purchaseId == null) return;
        purchaseRepository.findById(Objects.requireNonNull(UUID.fromString(purchaseId))).ifPresent(purchase -> {
            purchase.setStatus("FAILED");
            purchaseRepository.save(purchase);
        });
    }
}
