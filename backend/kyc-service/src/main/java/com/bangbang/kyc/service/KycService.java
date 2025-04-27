package com.bangbang.kyc.service;

import com.bangbang.kyc.dto.KycSubmissionRequest;
import com.bangbang.kyc.dto.KycVerificationResponse;
import com.bangbang.kyc.model.KycStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service for KYC verification operations
 */
public interface KycService {
    
    /**
     * Submit a new KYC verification
     * 
     * @param request the KYC submission request
     * @return the created KYC verification
     */
    KycVerificationResponse submitKycVerification(KycSubmissionRequest request);
    
    /**
     * Get a KYC verification by ID
     * 
     * @param verificationId the verification ID
     * @return the KYC verification
     */
    KycVerificationResponse getKycVerification(Long verificationId);
    
    /**
     * Get a user's KYC verification
     * 
     * @param userId the user ID
     * @return the KYC verification, if exists
     */
    KycVerificationResponse getUserKycVerification(Long userId);
    
    /**
     * Get KYC verifications by status with pagination
     * 
     * @param status the status to filter by
     * @param pageable pagination information
     * @return paginated KYC verifications
     */
    Page<KycVerificationResponse> getKycVerificationsByStatus(KycStatus status, Pageable pageable);
    
    /**
     * Approve a KYC verification
     * 
     * @param verificationId the verification ID
     * @param verifierId the ID of the admin approving
     * @return the approved KYC verification
     */
    KycVerificationResponse approveKycVerification(Long verificationId, Long verifierId);
    
    /**
     * Reject a KYC verification
     * 
     * @param verificationId the verification ID
     * @param reason the rejection reason
     * @param verifierId the ID of the admin rejecting
     * @return the rejected KYC verification
     */
    KycVerificationResponse rejectKycVerification(Long verificationId, String reason, Long verifierId);
    
    /**
     * Upload a document file for KYC verification
     * 
     * @param userId the user ID
     * @param documentType the document type
     * @param file the file to upload
     * @return the URL of the uploaded file
     */
    String uploadDocument(Long userId, String documentType, MultipartFile file);
    
    /**
     * Check if a user has an approved KYC verification
     * 
     * @param userId the user ID
     * @return true if user has an approved verification
     */
    boolean isUserVerified(Long userId);
    
    /**
     * Get verifications expiring soon (within 30 days)
     * 
     * @return list of expiring verifications
     */
    List<KycVerificationResponse> getExpiringVerifications();
    
    /**
     * Delete a KYC verification
     * 
     * @param verificationId the verification ID
     */
    void deleteKycVerification(Long verificationId);
} 