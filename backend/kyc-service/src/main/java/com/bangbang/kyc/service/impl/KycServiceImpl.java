package com.bangbang.kyc.service.impl;

import com.bangbang.kyc.dto.DocumentRequest;
import com.bangbang.kyc.dto.DocumentResponse;
import com.bangbang.kyc.dto.KycSubmissionRequest;
import com.bangbang.kyc.dto.KycVerificationResponse;
import com.bangbang.kyc.exception.KycVerificationNotFoundException;
import com.bangbang.kyc.mapper.KycMapper;
import com.bangbang.kyc.model.KycDocument;
import com.bangbang.kyc.model.KycStatus;
import com.bangbang.kyc.model.KycVerification;
import com.bangbang.kyc.repository.KycDocumentRepository;
import com.bangbang.kyc.repository.KycVerificationRepository;
import com.bangbang.kyc.service.DocumentService;
import com.bangbang.kyc.service.KycService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class KycServiceImpl implements KycService {

    private final KycVerificationRepository verificationRepository;
    private final KycDocumentRepository documentRepository;
    private final DocumentService documentService;
    private final KycMapper kycMapper;

    @Autowired
    public KycServiceImpl(
            KycVerificationRepository verificationRepository,
            KycDocumentRepository documentRepository,
            DocumentService documentService,
            KycMapper kycMapper) {
        this.verificationRepository = verificationRepository;
        this.documentRepository = documentRepository;
        this.documentService = documentService;
        this.kycMapper = kycMapper;
    }

    @Override
    @Transactional
    public KycVerificationResponse submitKycVerification(KycSubmissionRequest request) {
        // Check if user already has a verification
        Optional<KycVerification> existingVerification = verificationRepository.findByUserId(request.getVerification().getUserId());
        
        KycVerification verification;
        if (existingVerification.isPresent()) {
            // Update existing verification if it's in REJECTED or INCOMPLETE status
            KycVerification existing = existingVerification.get();
            KycStatus status = existing.getStatus();
            
            if (status == KycStatus.REJECTED || status == KycStatus.INCOMPLETE) {
                // Update with new data
                verification = kycMapper.verificationRequestToEntity(request.getVerification());
                verification.setId(existing.getId());
                verification.setStatus(KycStatus.PENDING);
                verification.setRejectionReason(null);
                verification.setVerifiedAt(null);
                verification.setVerifiedBy(null);
                verification.setExpiresAt(null);
                
                // Delete existing documents
                documentRepository.deleteByKycVerificationId(existing.getId());
            } else {
                throw new IllegalStateException("User already has an active KYC verification");
            }
        } else {
            // Create new verification
            verification = kycMapper.verificationRequestToEntity(request.getVerification());
        }
        
        // Save verification
        KycVerification savedVerification = verificationRepository.save(verification);
        
        // Add documents
        List<DocumentResponse> documents = request.getDocuments().stream()
                .map(docRequest -> {
                    DocumentRequest documentRequest = docRequest;
                    return documentService.addDocument(savedVerification.getId(), documentRequest);
                })
                .collect(Collectors.toList());
        
        return kycMapper.verificationToResponseWithDocuments(savedVerification, documents);
    }

    @Override
    @Transactional(readOnly = true)
    public KycVerificationResponse getKycVerification(Long verificationId) {
        KycVerification verification = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new KycVerificationNotFoundException("KYC verification not found with id: " + verificationId));
        
        List<KycDocument> documents = documentRepository.findByKycVerificationId(verificationId);
        List<DocumentResponse> documentResponses = kycMapper.documentsToResponses(documents);
        
        return kycMapper.verificationToResponseWithDocuments(verification, documentResponses);
    }

    @Override
    @Transactional(readOnly = true)
    public KycVerificationResponse getUserKycVerification(Long userId) {
        KycVerification verification = verificationRepository.findByUserId(userId)
                .orElseThrow(() -> new KycVerificationNotFoundException("KYC verification not found for user id: " + userId));
        
        List<KycDocument> documents = documentRepository.findByKycVerificationId(verification.getId());
        List<DocumentResponse> documentResponses = kycMapper.documentsToResponses(documents);
        
        return kycMapper.verificationToResponseWithDocuments(verification, documentResponses);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KycVerificationResponse> getKycVerificationsByStatus(KycStatus status, Pageable pageable) {
        Page<KycVerification> verifications = verificationRepository.findByStatus(status, pageable);
        
        return verifications.map(verification -> {
            List<KycDocument> documents = documentRepository.findByKycVerificationId(verification.getId());
            List<DocumentResponse> documentResponses = kycMapper.documentsToResponses(documents);
            return kycMapper.verificationToResponseWithDocuments(verification, documentResponses);
        });
    }

    @Override
    @Transactional
    public KycVerificationResponse approveKycVerification(Long verificationId, Long verifierId) {
        KycVerification verification = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new KycVerificationNotFoundException("KYC verification not found with id: " + verificationId));
        
        if (verification.getStatus() != KycStatus.PENDING) {
            throw new IllegalStateException("KYC verification is not in PENDING status");
        }
        
        verification.setStatus(KycStatus.APPROVED);
        verification.setVerifiedAt(LocalDateTime.now());
        verification.setVerifiedBy(verifierId);
        
        // Set expiration date (1 year from now)
        verification.setExpiresAt(LocalDateTime.now().plusYears(1));
        
        KycVerification updatedVerification = verificationRepository.save(verification);
        
        List<KycDocument> documents = documentRepository.findByKycVerificationId(updatedVerification.getId());
        List<DocumentResponse> documentResponses = kycMapper.documentsToResponses(documents);
        
        return kycMapper.verificationToResponseWithDocuments(updatedVerification, documentResponses);
    }

    @Override
    @Transactional
    public KycVerificationResponse rejectKycVerification(Long verificationId, String reason, Long verifierId) {
        KycVerification verification = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new KycVerificationNotFoundException("KYC verification not found with id: " + verificationId));
        
        if (verification.getStatus() != KycStatus.PENDING) {
            throw new IllegalStateException("KYC verification is not in PENDING status");
        }
        
        verification.setStatus(KycStatus.REJECTED);
        verification.setRejectionReason(reason);
        verification.setVerifiedAt(LocalDateTime.now());
        verification.setVerifiedBy(verifierId);
        
        KycVerification updatedVerification = verificationRepository.save(verification);
        
        List<KycDocument> documents = documentRepository.findByKycVerificationId(updatedVerification.getId());
        List<DocumentResponse> documentResponses = kycMapper.documentsToResponses(documents);
        
        return kycMapper.verificationToResponseWithDocuments(updatedVerification, documentResponses);
    }

    @Override
    public String uploadDocument(Long userId, String documentType, MultipartFile file) {
        return documentService.uploadDocumentFile(file);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserVerified(Long userId) {
        return verificationRepository.existsByUserIdAndStatus(userId, KycStatus.APPROVED);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KycVerificationResponse> getExpiringVerifications() {
        // Find verifications expiring in the next 30 days
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysFromNow = now.plusDays(30);
        
        List<KycVerification> expiringVerifications = verificationRepository.findByStatusAndExpiresAtBetween(
                KycStatus.APPROVED, now, thirtyDaysFromNow);
        
        return expiringVerifications.stream()
                .map(verification -> {
                    List<KycDocument> documents = documentRepository.findByKycVerificationId(verification.getId());
                    List<DocumentResponse> documentResponses = kycMapper.documentsToResponses(documents);
                    return kycMapper.verificationToResponseWithDocuments(verification, documentResponses);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteKycVerification(Long verificationId) {
        KycVerification verification = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new KycVerificationNotFoundException("KYC verification not found with id: " + verificationId));
        
        // First delete all associated documents
        documentService.deleteDocumentsByVerificationId(verificationId);
        
        // Then delete the verification
        verificationRepository.delete(verification);
    }
} 