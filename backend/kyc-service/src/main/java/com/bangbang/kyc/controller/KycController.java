package com.bangbang.kyc.controller;

import com.bangbang.kyc.dto.KycSubmissionRequest;
import com.bangbang.kyc.dto.KycVerificationResponse;
import com.bangbang.kyc.model.DocumentType;
import com.bangbang.kyc.model.KycStatus;
import com.bangbang.kyc.service.KycService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kyc")
@Slf4j
public class KycController {

    private final KycService kycService;

    @Autowired
    public KycController(KycService kycService) {
        this.kycService = kycService;
    }

    @PostMapping
    public ResponseEntity<KycVerificationResponse> submitKycVerification(
            @Valid @RequestBody KycSubmissionRequest request) {
        log.info("Submitting KYC verification for user: {}", request.getVerification().getUserId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(kycService.submitKycVerification(request));
    }

    @GetMapping("/{verificationId}")
    public ResponseEntity<KycVerificationResponse> getKycVerification(
            @PathVariable Long verificationId) {
        log.info("Fetching KYC verification with id: {}", verificationId);
        return ResponseEntity.ok(kycService.getKycVerification(verificationId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<KycVerificationResponse> getUserKycVerification(
            @PathVariable Long userId) {
        log.info("Fetching KYC verification for user: {}", userId);
        return ResponseEntity.ok(kycService.getUserKycVerification(userId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<KycVerificationResponse>> getKycVerificationsByStatus(
            @PathVariable KycStatus status,
            Pageable pageable) {
        log.info("Fetching KYC verifications with status: {}", status);
        return ResponseEntity.ok(kycService.getKycVerificationsByStatus(status, pageable));
    }

    @PutMapping("/{verificationId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KycVerificationResponse> approveKycVerification(
            @PathVariable Long verificationId,
            @RequestParam Long verifierId) {
        log.info("Approving KYC verification with id: {}", verificationId);
        return ResponseEntity.ok(kycService.approveKycVerification(verificationId, verifierId));
    }

    @PutMapping("/{verificationId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KycVerificationResponse> rejectKycVerification(
            @PathVariable Long verificationId,
            @RequestParam Long verifierId,
            @RequestParam String reason) {
        log.info("Rejecting KYC verification with id: {}", verificationId);
        return ResponseEntity.ok(kycService.rejectKycVerification(verificationId, reason, verifierId));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadDocument(
            @RequestParam Long userId,
            @RequestParam String documentType,
            @RequestParam MultipartFile file) {
        log.info("Uploading document for user: {}, type: {}", userId, documentType);
        String fileUrl = kycService.uploadDocument(userId, documentType, file);
        return ResponseEntity.ok(Map.of("fileUrl", fileUrl));
    }

    @GetMapping("/user/{userId}/verified")
    public ResponseEntity<Map<String, Boolean>> isUserVerified(
            @PathVariable Long userId) {
        log.info("Checking if user is verified: {}", userId);
        boolean isVerified = kycService.isUserVerified(userId);
        return ResponseEntity.ok(Map.of("verified", isVerified));
    }

    @GetMapping("/expiring")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<KycVerificationResponse>> getExpiringVerifications() {
        log.info("Fetching expiring KYC verifications");
        return ResponseEntity.ok(kycService.getExpiringVerifications());
    }

    @DeleteMapping("/{verificationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteKycVerification(
            @PathVariable Long verificationId) {
        log.info("Deleting KYC verification with id: {}", verificationId);
        kycService.deleteKycVerification(verificationId);
        return ResponseEntity.noContent().build();
    }
} 