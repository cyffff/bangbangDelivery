package com.bangbang.payment.service;

import com.bangbang.payment.dto.PaymentResponse;
import com.bangbang.payment.dto.WeChatPayDetails;
import com.bangbang.payment.model.Payment;

import java.math.BigDecimal;

public interface WeChatPayProcessor {
    
    PaymentResponse processWeChatPayment(Payment payment, WeChatPayDetails weChatPayDetails);
    
    PaymentResponse refundWeChatPayment(Payment payment, BigDecimal amount, String reason);
    
    PaymentResponse verifyWeChatPayment(String transactionId);
    
    String generateQRCode(Payment payment, WeChatPayDetails weChatPayDetails);
} 