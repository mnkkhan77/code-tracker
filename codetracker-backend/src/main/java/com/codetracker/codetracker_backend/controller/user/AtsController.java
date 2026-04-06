package com.codetracker.codetracker_backend.controller.user;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
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
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.uploads.resumes-dir}")
    private String resumesDir;

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

        Path destination = null;
        Resume resume = null;
        try {
            // Save file to disk
            Path uploadPath = Paths.get(resumesDir, user.getId().toString());
            Files.createDirectories(uploadPath);
            String storedName = UUID.randomUUID() + "_" + originalName;
            destination = uploadPath.resolve(storedName);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            // Extract text — fail fast before deducting credit
            String resumeText;
            try {
                resumeText = extractText(file);
                if (resumeText == null || resumeText.isBlank()) {
                    Files.deleteIfExists(destination);
                    return ResponseEntity.badRequest()
                            .body(Map.of("success", false, "message", "Could not extract text from the PDF. Please ensure it is not scanned/image-only."));
                }
            } catch (Exception e) {
                Files.deleteIfExists(destination);
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Failed to read PDF: " + e.getMessage()));
            }

            // Deduct credits based on analysis mode
            user.setCredits(user.getCredits() - creditCost);
            userRepository.save(user);

            // Save resume record
            resume = new Resume();
            resume.setUser(user);
            resume.setFilename(originalName);
            resume.setFilePath(destination.toString());
            resume.setStatus("ANALYZING");
            resumeRepository.save(resume);

            // Call Groq — route to appropriate analysis method
            String analysisJson = isDetailed
                    ? openAiService.analyzeResumeDetailed(resumeText)
                    : openAiService.analyzeResume(resumeText, hasJd ? jobDescription : null);
            if (analysisJson != null) {
                try {
                    JsonNode analysis = objectMapper.readTree(analysisJson);
                    int atsScore = analysis.path("atsScore").asInt(0);
                    resume.setAtsScore(atsScore);
                    resume.setAnalysis(analysisJson);
                    resume.setStatus("COMPLETED");
                } catch (Exception e) {
                    log.warn("Failed to parse OpenAI response: {}", e.getMessage());
                    resume.setStatus("FAILED");
                }
            } else {
                log.warn("OpenAI returned null for resume {}", resume.getId());
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

        } catch (IOException e) {
            // Roll back file if saved
            if (destination != null) {
                try { Files.deleteIfExists(destination); } catch (IOException ignored) {}
            }
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Failed to process file: " + e.getMessage()));
        }
    }

    @Operation(summary = "Delete a resume by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Resume deleted"),
        @ApiResponse(responseCode = "403", description = "Not authorized"),
        @ApiResponse(responseCode = "404", description = "Resume not found")
    })
    @org.springframework.web.bind.annotation.DeleteMapping("/resumes/{id}")
    public ResponseEntity<Map<String, Object>> deleteResume(
            @org.springframework.web.bind.annotation.PathVariable UUID id,
            Authentication auth) {

        User user = resolveUser(auth);
        Resume resume = resumeRepository.findById(id)
                .orElse(null);

        if (resume == null) {
            return ResponseEntity.notFound().build();
        }
        if (!resume.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Not authorized"));
        }

        // Delete file from disk
        try {
            Files.deleteIfExists(Paths.get(resume.getFilePath()));
        } catch (IOException e) {
            log.warn("Could not delete file {}: {}", resume.getFilePath(), e.getMessage());
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
                    return map;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    private String extractText(MultipartFile file) throws IOException {
        try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
            return new PDFTextStripper().getText(doc);
        }
    }

    private User resolveUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
