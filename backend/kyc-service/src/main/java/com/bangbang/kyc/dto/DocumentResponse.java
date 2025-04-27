package com.bangbang.kyc.dto;

import com.bangbang.kyc.model.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    
    private Long id;
    private Long kycVerificationId;
    private DocumentType documentType;
    private String documentNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String issuingCountry;
    private String documentUrl;
    private String backSideUrl;
    private String selfieUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 