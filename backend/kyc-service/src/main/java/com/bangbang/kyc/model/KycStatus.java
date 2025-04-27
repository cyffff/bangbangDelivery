package com.bangbang.kyc.model;

/**
 * Enum representing the status of a KYC verification
 */
public enum KycStatus {
    PENDING,     // Initial state when documents are submitted but not verified
    APPROVED,    // Documents verified and approved
    REJECTED,    // Documents rejected due to issues
    EXPIRED,     // Verification has expired and needs renewal
    INCOMPLETE   // Required documents or information missing
} 