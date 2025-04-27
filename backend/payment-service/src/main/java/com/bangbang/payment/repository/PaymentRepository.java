package com.bangbang.payment.repository;

import com.bangbang.payment.model.Payment;
import com.bangbang.payment.model.PaymentMethod;
import com.bangbang.payment.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByOrderId(Long orderId);
    
    List<Payment> findByPayerId(Long payerId);
    
    List<Payment> findByReceiverId(Long receiverId);
    
    List<Payment> findByStatus(PaymentStatus status);
    
    List<Payment> findByPaymentMethod(PaymentMethod paymentMethod);
    
    List<Payment> findByPayerIdAndStatus(Long payerId, PaymentStatus status);
    
    List<Payment> findByReceiverIdAndStatus(Long receiverId, PaymentStatus status);
    
    List<Payment> findByTransactionId(String transactionId);
    
    List<Payment> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
} 