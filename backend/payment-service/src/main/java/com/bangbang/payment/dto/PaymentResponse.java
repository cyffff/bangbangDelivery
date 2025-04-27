package com.bangbang.payment.dto;

import com.bangbang.payment.model.PaymentMethod;
import com.bangbang.payment.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    
    private Long id;
    private Long orderId;
    private Long payerId;
    private Long receiverId;
    private BigDecimal amount;
    private BigDecimal fee;
    private BigDecimal netAmount;
    private PaymentStatus status;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // For WeChat Pay redirect
    private String redirectUrl;
    
    // For client-side processing (e.g., credit card form redirect)
    private String clientSecret;
} 