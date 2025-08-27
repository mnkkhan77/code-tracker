package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.entity.Purchase;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PurchaseService {
    Purchase createPurchase(Purchase purchase);

    Optional<Purchase> getPurchaseById(UUID purchaseId);

    List<Purchase> getPurchasesByUser(UUID userId);

    Purchase updatePurchase(UUID purchaseId, Purchase updated);

    void deletePurchase(UUID purchaseId);
}

