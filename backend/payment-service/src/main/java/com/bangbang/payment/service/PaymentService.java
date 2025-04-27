package com.bangbang.payment.service;

import com.bangbang.payment.dto.PaymentRequest;
import com.bangbang.payment.dto.PaymentResponse;
import com.bangbang.payment.model.PaymentMethod;
import com.bangbang.payment.model.PaymentStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentService {
    
    PaymentResponse initiatePayment(PaymentRequest paymentRequest);
    
    PaymentResponse getPaymentById(Long id);
    
    List<PaymentResponse> getPaymentsByOrderId(Long orderId);
    
    List<PaymentResponse> getPaymentsByPayerId(Long payerId);
    
    List<PaymentResponse> getPaymentsByReceiverId(Long receiverId);
    
    List<PaymentResponse> getPaymentsByStatus(PaymentStatus status);
    
    List<PaymentResponse> getPaymentsByMethod(PaymentMethod method);
    
    List<PaymentResponse> getPaymentsByPayerIdAndStatus(Long payerId, PaymentStatus status);
    
    List<PaymentResponse> getPaymentsByReceiverIdAndStatus(Long receiverId, PaymentStatus status);
    
    List<PaymentResponse> getPaymentsByDateRange(LocalDateTime start, LocalDateTime end);
    
    PaymentResponse processPaymentCallback(String transactionId, PaymentStatus status, String details);
    
    PaymentResponse refundPayment(Long paymentId, String reason);
} 