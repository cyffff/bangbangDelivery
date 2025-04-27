package com.bangbang.kyc.dto;

import com.bangbang.kyc.model.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentRequest {
    
    @NotNull(message = "Document type is required")
    private DocumentType documentType;
    
    @NotBlank(message = "Document number is required")
    private String documentNumber;
    
    private LocalDate issueDate;
    
    private LocalDate expiryDate;
    
    private String issuingCountry;
    
    @NotBlank(message = "Document URL is required")
    private String documentUrl;
    
    private String backSideUrl;
    
    private String selfieUrl;
} 