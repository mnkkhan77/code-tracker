package com.codetracker.codetracker_backend.service.serviceImpl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.codetracker.codetracker_backend.entity.Purchase;
import com.codetracker.codetracker_backend.repository.PurchaseRepository;
import com.codetracker.codetracker_backend.service.PurchaseService;

import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;

    @Override
    public Purchase createPurchase(@NonNull Purchase purchase) {
        return purchaseRepository.save(purchase);
    }

    @Override
    public Optional<Purchase> getPurchaseById(@NonNull UUID purchaseId) {
        return purchaseRepository.findById(purchaseId);
    }

    @Override
    public List<Purchase> getPurchasesByUser(UUID userId) {
        return purchaseRepository.findByUser_Id(userId);
    }

    @Override
    public Purchase updatePurchase(@NonNull UUID purchaseId, Purchase updated) {
        return purchaseRepository.findById(purchaseId)
                .map(existing -> {
                    existing.setAmount(updated.getAmount());
                    existing.setDescription(updated.getDescription());
                    existing.setPurchaseDate(updated.getPurchaseDate());
                    return purchaseRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Purchase not found"));
    }


    @Override
    public void deletePurchase(@NonNull UUID purchaseId) {
        purchaseRepository.deleteById(purchaseId);
    }
}