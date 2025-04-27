package com.bangbang.kyc.service;

import com.bangbang.kyc.dto.DocumentRequest;
import com.bangbang.kyc.dto.DocumentResponse;
import com.bangbang.kyc.model.DocumentType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service for document operations
 */
public interface DocumentService {
    
    /**
     * Add a document to a KYC verification
     * 
     * @param kycVerificationId the KYC verification ID
     * @param documentRequest the document request
     * @return the created document
     */
    DocumentResponse addDocument(Long kycVerificationId, DocumentRequest documentRequest);
    
    /**
     * Get a document by ID
     * 
     * @param documentId the document ID
     * @return the document
     */
    DocumentResponse getDocument(Long documentId);
    
    /**
     * Get documents by KYC verification ID
     * 
     * @param kycVerificationId the KYC verification ID
     * @return list of documents
     */
    List<DocumentResponse> getDocumentsByVerificationId(Long kycVerificationId);
    
    /**
     * Get documents by KYC verification ID and document type
     * 
     * @param kycVerificationId the KYC verification ID
     * @param documentType the document type
     * @return list of documents
     */
    List<DocumentResponse> getDocumentsByVerificationIdAndType(Long kycVerificationId, DocumentType documentType);
    
    /**
     * Upload a document file
     * 
     * @param file the file to upload
     * @return the URL of the uploaded file
     */
    String uploadDocumentFile(MultipartFile file);
    
    /**
     * Update a document
     * 
     * @param documentId the document ID
     * @param documentRequest the updated document request
     * @return the updated document
     */
    DocumentResponse updateDocument(Long documentId, DocumentRequest documentRequest);
    
    /**
     * Delete a document
     * 
     * @param documentId the document ID
     */
    void deleteDocument(Long documentId);
    
    /**
     * Delete all documents for a KYC verification
     * 
     * @param kycVerificationId the KYC verification ID
     */
    void deleteDocumentsByVerificationId(Long kycVerificationId);
} 