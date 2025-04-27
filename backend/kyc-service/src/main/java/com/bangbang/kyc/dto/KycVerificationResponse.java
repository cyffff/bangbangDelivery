package com.bangbang.kyc.dto;

import com.bangbang.kyc.model.KycStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycVerificationResponse {
    
    private Long id;
    private Long userId;
    private String fullName;
    private LocalDate dateOfBirth;
    private String nationality;
    private String address;
    private String city;
    private String country;
    private String postalCode;
    private String phoneNumber;
    private KycStatus status;
    private String rejectionReason;
    private LocalDateTime verifiedAt;
    private Long verifiedBy;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<DocumentResponse> documents;
} 