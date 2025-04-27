package com.bangbang.payment.service;

import com.bangbang.payment.dto.CreditCardDetails;
import com.bangbang.payment.dto.PaymentResponse;
import com.bangbang.payment.model.Payment;

import java.math.BigDecimal;

public interface CreditCardPaymentProcessor {
    
    PaymentResponse processCreditCardPayment(Payment payment, CreditCardDetails creditCardDetails);
    
    PaymentResponse refundCreditCardPayment(Payment payment, BigDecimal amount, String reason);
    
    PaymentResponse verifyCreditCardPayment(String transactionId);
} 