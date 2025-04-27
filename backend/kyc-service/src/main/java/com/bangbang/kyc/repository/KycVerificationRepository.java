package com.bangbang.kyc.repository;

import com.bangbang.kyc.model.KycStatus;
import com.bangbang.kyc.model.KycVerification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface KycVerificationRepository extends JpaRepository<KycVerification, Long> {
    
    /**
     * Find the latest KYC verification for a user
     */
    Optional<KycVerification> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    
    /**
     * Find all KYC verifications for a user
     */
    List<KycVerification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    /**
     * Find all KYC verifications by status
     */
    Page<KycVerification> findByStatus(KycStatus status, Pageable pageable);
    
    /**
     * Find all KYC verifications that are about to expire
     */
    List<KycVerification> findByStatusAndExpiresAtBetween(
            KycStatus status, 
            LocalDateTime start, 
            LocalDateTime end);
    
    /**
     * Count KYC verifications by status
     */
    long countByStatus(KycStatus status);
    
    /**
     * Check if a user has an approved KYC verification
     */
    boolean existsByUserIdAndStatus(Long userId, KycStatus status);
    
    // Find verification by user ID
    Optional<KycVerification> findByUserId(Long userId);
    
    // Find verifications by status
    List<KycVerification> findByStatus(KycStatus status);
    
    // Find verifications that need attention (pending or incomplete)
    List<KycVerification> findByStatusIn(List<KycStatus> statuses);
    
    // Find verifications by verificator
    List<KycVerification> findByVerifiedBy(Long verifierId);
} 