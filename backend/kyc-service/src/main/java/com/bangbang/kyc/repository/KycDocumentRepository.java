package com.bangbang.kyc.repository;

import com.bangbang.kyc.model.DocumentType;
import com.bangbang.kyc.model.KycDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KycDocumentRepository extends JpaRepository<KycDocument, Long> {
    
    /**
     * Find all documents for a KYC verification
     */
    List<KycDocument> findByKycVerificationId(Long kycVerificationId);
    
    /**
     * Find a document by its verification ID and type
     */
    List<KycDocument> findByKycVerificationIdAndDocumentType(Long kycVerificationId, DocumentType documentType);
    
    /**
     * Count documents by KYC verification ID
     */
    long countByKycVerificationId(Long kycVerificationId);
    
    /**
     * Check if a document type exists for a verification
     */
    boolean existsByKycVerificationIdAndDocumentType(Long kycVerificationId, DocumentType documentType);
    
    /**
     * Delete all documents for a KYC verification
     */
    void deleteByKycVerificationId(Long kycVerificationId);
} 