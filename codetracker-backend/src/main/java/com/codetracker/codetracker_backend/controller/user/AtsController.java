package com.codetracker.codetracker_backend.controller.user;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.codetracker.codetracker_backend.entity.Purchase;
import com.codetracker.codetracker_backend.entity.Resume;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.repository.PurchaseRepository;
import com.codetracker.codetracker_backend.repository.ResumeRepository;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.FilebaseService;
import com.codetracker.codetracker_backend.service.OpenAiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "ATS Resume Checker", description = "Resume upload and AI-powered ATS scoring")
@Slf4j
@RestController
@RequestMapping("/api/ats")
@RequiredArgsConstructor
public class AtsController {

    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final PurchaseRepository purchaseRepository;
    private final OpenAiService openAiService;
    private final FilebaseService filebaseService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Map<String, int[]> PACKAGES = Map.of(
            "small",  new int[]{5,  5},
            "medium", new int[]{15, 12},
            "large",  new int[]{30, 20}
    );

    @Operation(summary = "Get current user's credit balance")
    @ApiResponse(responseCode = "200", description = "Credit balance returned")
    @GetMapping("/credits")
    public ResponseEntity<Map<String, Object>> getCredits(Authentication auth) {
        User user = resolveUser(auth);
        return ResponseEntity.ok(Map.of("credits", user.getCredits()));
    }

    @Operation(summary = "Purchase a credit package (small/medium/large)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Credits purchased"),
        @ApiResponse(responseCode = "400", description = "Invalid package type")
    })
    @PostMapping("/purchase")
    public ResponseEntity<Map<String, Object>> purchaseCredits(
            @RequestBody Map<String, String> body,
            Authentication auth) {

        String packageType = body.getOrDefault("packageType", "").toLowerCase();
        int[] pkg = PACKAGES.get(packageType);
        if (pkg == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Invalid package. Choose: small, medium, large"));
        }

        int creditsToAdd = pkg[0];
        int price = pkg[1];

        User user = resolveUser(auth);
        user.setCredits(user.getCredits() + creditsToAdd);
        userRepository.save(user);

        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setProductType("CREDITS");
        purchase.setAmount(BigDecimal.valueOf(price));
        purchase.setCurrency("USD");
        purchase.setStatus("COMPLETED");
        purchase.setPaidAt(LocalDateTime.now());
        purchase.setProviderRef("manual-" + UUID.randomUUID());
        purchaseRepository.save(purchase);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "creditsAdded", creditsToAdd,
                "totalCredits", user.getCredits(),
                "amountCharged", price
        ));
    }

    @Operation(summary = "Upload a resume for ATS analysis (costs credits)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Resume analyzed successfully"),
        @ApiResponse(responseCode = "400", description = "Insufficient credits or invalid file")
    })
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadResume(
            @RequestParam("resume") MultipartFile file,
            @RequestParam(value = "jobDescription", required = false) String jobDescription,
            @RequestParam(value = "analysisMode", required = false, defaultValue = "standard") String analysisMode,
            Authentication auth) {

        User user = resolveUser(auth);
        boolean isDetailed = "detailed".equalsIgnoreCase(analysisMode);
        boolean hasJd = !isDetailed && jobDescription != null && !jobDescription.isBlank();
        double creditCost = isDetailed ? 2.0 : (hasJd ? 2.5 : 1.0);

        if (user.getCredits() < creditCost) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message",
                            "Insufficient credits. This analysis requires " + creditCost + " credits. You have " + user.getCredits() + "."));
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null || (!originalName.endsWith(".pdf") && !originalName.endsWith(".docx"))) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Only PDF and DOCX files are accepted."));
        }

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Failed to read uploaded file: " + e.getMessage()));
        }

        // Extract text before deducting credits — fail fast if unreadable
        String resumeText;
        try {
            resumeText = extractText(fileBytes);
            if (resumeText == null || resumeText.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message",
                                "Could not extract text from the file. Ensure it is not a scanned/image-only PDF."));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Failed to read file: " + e.getMessage()));
        }

        // Deduct credits
        user.setCredits(user.getCredits() - creditCost);
        userRepository.save(user);

        // Upload to Filebase
        String key = "resumes/" + user.getId() + "/" + UUID.randomUUID() + "_" + originalName;
        String contentType = originalName.endsWith(".pdf")
                ? "application/pdf"
                : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        try {
            filebaseService.upload(key, fileBytes, contentType);
        } catch (Exception e) {
            // Restore credits if upload fails
            user.setCredits(user.getCredits() + creditCost);
            userRepository.save(user);
            log.error("[Filebase] Upload failed: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Failed to store file. Please try again."));
        }

        // Save resume record — filePath stores the Filebase object key
        Resume resume = new Resume();
        resume.setUser(user);
        resume.setFilename(originalName);
        resume.setFilePath(key);
        resume.setStatus("ANALYZING");
        resumeRepository.save(resume);

        // Run AI analysis
        String analysisJson = isDetailed
                ? openAiService.analyzeResumeDetailed(resumeText)
                : openAiService.analyzeResume(resumeText, hasJd ? jobDescription : null);

        if (analysisJson != null) {
            try {
                JsonNode analysis = objectMapper.readTree(analysisJson);
                resume.setAtsScore(analysis.path("atsScore").asInt(0));
                resume.setAnalysis(analysisJson);
                resume.setStatus("COMPLETED");
            } catch (Exception e) {
                log.warn("Failed to parse analysis response: {}", e.getMessage());
                resume.setStatus("FAILED");
            }
        } else {
            log.warn("AI returned null for resume {}", resume.getId());
            resume.setStatus("FAILED");
        }
        resumeRepository.save(resume);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("resumeId", resume.getId());
        response.put("filename", originalName);
        response.put("remainingCredits", user.getCredits());
        response.put("status", resume.getStatus());
        if (resume.getAtsScore() != null) response.put("atsScore", resume.getAtsScore());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete a resume by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Resume deleted"),
        @ApiResponse(responseCode = "403", description = "Not authorized"),
        @ApiResponse(responseCode = "404", description = "Resume not found")
    })
    @DeleteMapping("/resumes/{id}")
    public ResponseEntity<Map<String, Object>> deleteResume(
            @PathVariable @NonNull UUID id,
            Authentication auth) {

        User user = resolveUser(auth);
        Resume resume = resumeRepository.findById(id).orElse(null);

        if (resume == null) return ResponseEntity.notFound().build();
        if (!resume.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Not authorized"));
        }

        try {
            filebaseService.delete(resume.getFilePath());
        } catch (Exception e) {
            log.warn("[Filebase] Could not delete {}: {}", resume.getFilePath(), e.getMessage());
        }

        resumeRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @Operation(summary = "Get all resumes uploaded by current user")
    @ApiResponse(responseCode = "200", description = "List of resumes with analysis results")
    @GetMapping("/resumes")
    public ResponseEntity<List<Map<String, Object>>> getResumes(Authentication auth) {
        User user = resolveUser(auth);

        List<Map<String, Object>> result = resumeRepository
                .findByUserIdOrderByUploadedAtDesc(user.getId())
                .stream()
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id",         r.getId());
                    map.put("filename",   r.getFilename());
                    map.put("uploadedAt", r.getUploadedAt());
                    map.put("status",     r.getStatus());
                    if (r.getAtsScore() != null) map.put("atsScore", r.getAtsScore());
                    if (r.getAnalysis()  != null) {
                        try {
                            map.put("analysisResult", objectMapper.readTree(r.getAnalysis()));
                        } catch (Exception e) {
                            map.put("analysisResult", null);
                        }
                    }
                    // 1-hour presigned download URL
                    try {
                        map.put("fileUrl", filebaseService.presignedUrl(r.getFilePath(), Duration.ofHours(1)));
                    } catch (Exception e) {
                        log.warn("[Filebase] Could not generate presigned URL for {}: {}", r.getFilePath(), e.getMessage());
                    }
                    return map;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    private String extractText(byte[] bytes) throws IOException {
        try (PDDocument doc = Loader.loadPDF(bytes)) {
            return new PDFTextStripper().getText(doc);
        }
    }

    private User resolveUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
