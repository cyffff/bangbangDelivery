package com.bangbang.kyc.dto;

import com.bangbang.kyc.model.KycStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycVerificationUpdateRequest {
    
    @NotNull(message = "Status is required")
    private KycStatus status;
    
    private String rejectionReason;
    
    @NotNull(message = "Verifier ID is required")
    private Long verifiedBy;
} 