package com.bangbang.kyc.service.impl;

import com.bangbang.kyc.dto.DocumentRequest;
import com.bangbang.kyc.dto.DocumentResponse;
import com.bangbang.kyc.exception.DocumentNotFoundException;
import com.bangbang.kyc.exception.KycVerificationNotFoundException;
import com.bangbang.kyc.mapper.KycMapper;
import com.bangbang.kyc.model.DocumentType;
import com.bangbang.kyc.model.KycDocument;
import com.bangbang.kyc.model.KycVerification;
import com.bangbang.kyc.repository.KycDocumentRepository;
import com.bangbang.kyc.repository.KycVerificationRepository;
import com.bangbang.kyc.service.DocumentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class DocumentServiceImpl implements DocumentService {

    private final KycDocumentRepository documentRepository;
    private final KycVerificationRepository verificationRepository;
    private final KycMapper kycMapper;
    
    @Value("${app.document.upload-dir:uploads/documents}")
    private String uploadDir;

    @Autowired
    public DocumentServiceImpl(
            KycDocumentRepository documentRepository,
            KycVerificationRepository verificationRepository,
            KycMapper kycMapper) {
        this.documentRepository = documentRepository;
        this.verificationRepository = verificationRepository;
        this.kycMapper = kycMapper;
    }

    @Override
    @Transactional
    public DocumentResponse addDocument(Long kycVerificationId, DocumentRequest documentRequest) {
        // Check if verification exists
        if (!verificationRepository.existsById(kycVerificationId)) {
            throw new KycVerificationNotFoundException("KYC verification not found with id: " + kycVerificationId);
        }
        
        // Map request to entity
        KycDocument document = kycMapper.documentRequestToEntity(documentRequest);
        document.setKycVerificationId(kycVerificationId);
        
        // Save document
        KycDocument savedDocument = documentRepository.save(document);
        
        return kycMapper.documentToResponse(savedDocument);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentResponse getDocument(Long documentId) {
        KycDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with id: " + documentId));
        
        return kycMapper.documentToResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocumentsByVerificationId(Long kycVerificationId) {
        // Check if verification exists
        if (!verificationRepository.existsById(kycVerificationId)) {
            throw new KycVerificationNotFoundException("KYC verification not found with id: " + kycVerificationId);
        }
        
        List<KycDocument> documents = documentRepository.findByKycVerificationId(kycVerificationId);
        return kycMapper.documentsToResponses(documents);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocumentsByVerificationIdAndType(Long kycVerificationId, DocumentType documentType) {
        // Check if verification exists
        if (!verificationRepository.existsById(kycVerificationId)) {
            throw new KycVerificationNotFoundException("KYC verification not found with id: " + kycVerificationId);
        }
        
        List<KycDocument> documents = documentRepository.findByKycVerificationIdAndDocumentType(kycVerificationId, documentType);
        return kycMapper.documentsToResponses(documents);
    }

    @Override
    public String uploadDocumentFile(MultipartFile file) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate a unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            
            // Save the file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Return the file path relative to the upload directory
            return filename;
        } catch (IOException ex) {
            log.error("Failed to upload document file", ex);
            throw new RuntimeException("Failed to upload document file: " + ex.getMessage());
        }
    }

    @Override
    @Transactional
    public DocumentResponse updateDocument(Long documentId, DocumentRequest documentRequest) {
        KycDocument existingDocument = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with id: " + documentId));
        
        // Update document fields
        existingDocument.setDocumentType(documentRequest.getDocumentType());
        existingDocument.setDocumentNumber(documentRequest.getDocumentNumber());
        existingDocument.setIssueDate(documentRequest.getIssueDate());
        existingDocument.setExpiryDate(documentRequest.getExpiryDate());
        existingDocument.setIssuingCountry(documentRequest.getIssuingCountry());
        existingDocument.setDocumentUrl(documentRequest.getDocumentUrl());
        existingDocument.setBackSideUrl(documentRequest.getBackSideUrl());
        existingDocument.setSelfieUrl(documentRequest.getSelfieUrl());
        
        // Save updated document
        KycDocument updatedDocument = documentRepository.save(existingDocument);
        
        return kycMapper.documentToResponse(updatedDocument);
    }

    @Override
    @Transactional
    public void deleteDocument(Long documentId) {
        if (!documentRepository.existsById(documentId)) {
            throw new DocumentNotFoundException("Document not found with id: " + documentId);
        }
        
        documentRepository.deleteById(documentId);
    }

    @Override
    @Transactional
    public void deleteDocumentsByVerificationId(Long kycVerificationId) {
        // Check if verification exists
        if (!verificationRepository.existsById(kycVerificationId)) {
            throw new KycVerificationNotFoundException("KYC verification not found with id: " + kycVerificationId);
        }
        
        documentRepository.deleteByKycVerificationId(kycVerificationId);
    }
} 