package com.bangbang.kyc.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycSubmissionRequest {
    
    @NotNull(message = "Verification details are required")
    @Valid
    private KycVerificationRequest verification;
    
    @NotEmpty(message = "At least one document is required")
    @Valid
    private List<DocumentRequest> documents;
} 