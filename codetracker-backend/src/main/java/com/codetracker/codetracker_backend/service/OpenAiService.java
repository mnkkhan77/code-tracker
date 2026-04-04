package com.codetracker.codetracker_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

@Slf4j
@Service
public class OpenAiService {

    @Value("${app.openai.api-key}")
    private String apiKey;

    @Value("${app.openai.model}")
    private String model;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Standard ATS analysis. When jobDescription is provided, performs keyword matching.
     * When not provided, performs general ATS compatibility check (no keyword comparison).
     */
    public String analyzeResume(String resumeText, String jobDescription) {
        boolean hasJd = jobDescription != null && !jobDescription.isBlank();

        String prompt = hasJd ? """
                You are an expert ATS (Applicant Tracking System) resume analyzer.
                Analyze the resume against the provided job description and return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
                {
                  "atsScore": <integer 0-100>,
                  "sections": [
                    { "name": "<section name>", "score": <integer 0-100>, "feedback": "<short feedback>" }
                  ],
                  "keywordMatches": ["<keyword found in both resume and job description>"],
                  "missingKeywords": ["<important keyword from job description missing in resume>"],
                  "strengths": ["<strength>"],
                  "improvements": ["<improvement suggestion>"],
                  "formatIssues": ["<formatting issue>"],
                  "overallFeedback": "<2-3 sentence overall summary>"
                }

                Resume:
                %s

                Job Description:
                %s
                """.formatted(resumeText, jobDescription)
                : """
                You are an expert ATS (Applicant Tracking System) resume analyzer.
                Analyze the resume for general ATS compatibility (no job description is provided, so do NOT produce keyword comparisons).
                Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
                {
                  "atsScore": <integer 0-100>,
                  "sections": [
                    { "name": "<section name>", "score": <integer 0-100>, "feedback": "<short feedback>" }
                  ],
                  "strengths": ["<strength>"],
                  "improvements": ["<improvement suggestion>"],
                  "formatIssues": ["<formatting issue>"],
                  "overallFeedback": "<2-3 sentence overall summary>"
                }

                Resume:
                %s
                """.formatted(resumeText);

        return callGroq(prompt, 2048);
    }

    /**
     * Detailed enhancement analysis. Returns exact text suggestions for each weak spot.
     */
    public String analyzeResumeDetailed(String resumeText) {
        String prompt = """
                You are an expert resume coach and ATS specialist.
                Analyze the resume and identify specific sections or bullet points that need improvement.
                For each issue, provide the original weak text and an improved rewrite.
                Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
                {
                  "atsScore": <integer 0-100>,
                  "sections": [
                    { "name": "<section name>", "score": <integer 0-100>, "feedback": "<short feedback>" }
                  ],
                  "strengths": ["<strength>"],
                  "improvements": ["<high-level improvement suggestion>"],
                  "formatIssues": ["<formatting issue>"],
                  "overallFeedback": "<2-3 sentence overall summary>",
                  "detailedEnhancements": [
                    {
                      "section": "<section name, e.g. Work Experience>",
                      "issue": "<brief description of the problem>",
                      "originalText": "<the weak sentence or bullet point from the resume, verbatim>",
                      "suggestedText": "<improved rewrite with strong action verbs, quantified impact, and ATS keywords>",
                      "reason": "<why this change improves ATS score and recruiter appeal>"
                    }
                  ]
                }

                Provide at least 5 detailed enhancements covering different sections.

                Resume:
                %s
                """.formatted(resumeText);

        return callGroq(prompt, 6000);
    }

    private String callGroq(String prompt, int maxTokens) {
        try {
            String requestBody = objectMapper.writeValueAsString(Map.of(
                    "model", model,
                    "messages", new Object[]{
                            Map.of("role", "user", "content", prompt)
                    },
                    "temperature", 0.3,
                    "max_tokens", maxTokens
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("Groq API error {}: {}", response.statusCode(), response.body());
                return null;
            }

            JsonNode root = objectMapper.readTree(response.body());
            String content = root.path("choices").get(0).path("message").path("content").asText();
            // Strip markdown code fences that some models add despite instructions
            content = content.trim();
            if (content.startsWith("```")) {
                content = content.replaceAll("^```(?:json)?\\s*", "").replaceAll("```\\s*$", "").trim();
            }
            return content;

        } catch (Exception e) {
            log.error("Failed to call Groq API", e);
            return null;
        }
    }
}
