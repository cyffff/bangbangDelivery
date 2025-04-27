package com.bangbang.kyc.controller;

import com.bangbang.kyc.dto.DocumentRequest;
import com.bangbang.kyc.dto.DocumentResponse;
import com.bangbang.kyc.model.DocumentType;
import com.bangbang.kyc.service.DocumentService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@Slf4j
public class DocumentController {

    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/{kycVerificationId}")
    public ResponseEntity<DocumentResponse> addDocument(
            @PathVariable Long kycVerificationId,
            @Valid @RequestBody DocumentRequest documentRequest) {
        log.info("Adding document to KYC verification: {}", kycVerificationId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(documentService.addDocument(kycVerificationId, documentRequest));
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<DocumentResponse> getDocument(
            @PathVariable Long documentId) {
        log.info("Fetching document with id: {}", documentId);
        return ResponseEntity.ok(documentService.getDocument(documentId));
    }

    @GetMapping("/verification/{kycVerificationId}")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByVerificationId(
            @PathVariable Long kycVerificationId) {
        log.info("Fetching documents for KYC verification: {}", kycVerificationId);
        return ResponseEntity.ok(documentService.getDocumentsByVerificationId(kycVerificationId));
    }

    @GetMapping("/verification/{kycVerificationId}/type/{documentType}")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByVerificationIdAndType(
            @PathVariable Long kycVerificationId,
            @PathVariable DocumentType documentType) {
        log.info("Fetching documents for KYC verification: {} and type: {}", kycVerificationId, documentType);
        return ResponseEntity.ok(documentService.getDocumentsByVerificationIdAndType(kycVerificationId, documentType));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadDocumentFile(
            @RequestParam MultipartFile file) {
        log.info("Uploading document file: {}", file.getOriginalFilename());
        String fileUrl = documentService.uploadDocumentFile(file);
        return ResponseEntity.ok(Map.of("fileUrl", fileUrl));
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<DocumentResponse> updateDocument(
            @PathVariable Long documentId,
            @Valid @RequestBody DocumentRequest documentRequest) {
        log.info("Updating document with id: {}", documentId);
        return ResponseEntity.ok(documentService.updateDocument(documentId, documentRequest));
    }

    @DeleteMapping("/{documentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long documentId) {
        log.info("Deleting document with id: {}", documentId);
        documentService.deleteDocument(documentId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/verification/{kycVerificationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDocumentsByVerificationId(
            @PathVariable Long kycVerificationId) {
        log.info("Deleting documents for KYC verification: {}", kycVerificationId);
        documentService.deleteDocumentsByVerificationId(kycVerificationId);
        return ResponseEntity.noContent().build();
    }
} 