package com.bangbang.payment.model;

public enum PaymentStatus {
    PENDING,        // Payment is initiated but not completed
    PROCESSING,     // Payment is being processed by the payment provider
    COMPLETED,      // Payment has been successfully processed
    FAILED,         // Payment has failed
    REFUNDED,       // Payment has been refunded
    PARTIALLY_REFUNDED, // Payment has been partially refunded
    CANCELLED,      // Payment has been cancelled
    EXPIRED         // Payment request has expired
} 