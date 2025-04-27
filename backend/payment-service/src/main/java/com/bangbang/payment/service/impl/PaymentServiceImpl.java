package com.bangbang.payment.service.impl;

import com.bangbang.payment.dto.PaymentRequest;
import com.bangbang.payment.dto.PaymentResponse;
import com.bangbang.payment.exception.PaymentException;
import com.bangbang.payment.exception.ResourceNotFoundException;
import com.bangbang.payment.mapper.PaymentMapper;
import com.bangbang.payment.model.Payment;
import com.bangbang.payment.model.PaymentMethod;
import com.bangbang.payment.model.PaymentStatus;
import com.bangbang.payment.repository.PaymentRepository;
import com.bangbang.payment.service.CreditCardPaymentProcessor;
import com.bangbang.payment.service.PaymentService;
import com.bangbang.payment.service.WeChatPayProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final CreditCardPaymentProcessor creditCardPaymentProcessor;
    private final WeChatPayProcessor weChatPayProcessor;
    
    // Platform fee percentage (2.5%)
    private static final BigDecimal FEE_PERCENTAGE = new BigDecimal("0.025");

    @Override
    @Transactional
    public PaymentResponse initiatePayment(PaymentRequest paymentRequest) {
        log.info("Initiating payment for order ID: {}", paymentRequest.getOrderId());
        
        // Create payment entity from request
        Payment payment = paymentMapper.paymentRequestToPayment(paymentRequest);
        
        // Calculate fee and net amount
        BigDecimal fee = paymentRequest.getAmount().multiply(FEE_PERCENTAGE);
        payment.setFee(fee);
        payment.setNetAmount(paymentRequest.getAmount().subtract(fee));
        
        // Save initial payment record
        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment record created with ID: {}", savedPayment.getId());
        
        // Process payment based on payment method
        try {
            PaymentResponse response;
            switch (paymentRequest.getPaymentMethod()) {
                case CREDIT_CARD:
                    if (paymentRequest.getCreditCardDetails() == null) {
                        throw new PaymentException("Credit card details are required for credit card payments");
                    }
                    response = creditCardPaymentProcessor.processCreditCardPayment(savedPayment, paymentRequest.getCreditCardDetails());
                    break;
                case WECHAT_PAY:
                    if (paymentRequest.getWeChatPayDetails() == null) {
                        throw new PaymentException("WeChat Pay details are required for WeChat payments");
                    }
                    response = weChatPayProcessor.processWeChatPayment(savedPayment, paymentRequest.getWeChatPayDetails());
                    break;
                default:
                    throw new PaymentException("Unsupported payment method: " + paymentRequest.getPaymentMethod());
            }
            return response;
        } catch (Exception e) {
            log.error("Payment processing failed", e);
            // Update payment status to FAILED
            savedPayment.setStatus(PaymentStatus.FAILED);
            savedPayment.setPaymentDetails("Error: " + e.getMessage());
            paymentRepository.save(savedPayment);
            throw new PaymentException("Payment processing failed: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        log.info("Fetching payment with ID: {}", id);
        
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + id));
        
        return paymentMapper.paymentToPaymentResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByOrderId(Long orderId) {
        log.info("Fetching payments for order ID: {}", orderId);
        
        List<Payment> payments = paymentRepository.findByOrderId(orderId);
        
        return payments.stream()
                .map(paymentMapper::paymentToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByPayerId(Long payerId) {
        log.info("Fetching payments for payer ID: {}", payerId);
        
        List<Payment> payments = paymentRepository.findByPayerId(payerId);
        
        return payments.stream()
                .map(paymentMapper::paymentToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByReceiverId(Long receiverId) {
        log.info("Fetching payments for receiver ID: {}", receiverId);
        
        List<Payment> payments = paymentRepository.findByReceiverId(receiverId);
        
        return payments.stream()
                .map(paymentMapper::paymentToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByStatus(PaymentStatus status) {
        log.info("Fetching payments with status: {}", status);
        
        List<Payment> payments = paymentRepository.findByStatus(status);
        
        return payments.stream()
                .map(paymentMapper::paymentToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByMethod(PaymentMethod method) {
        log.info("Fetching payments with method: {}", method);
        
        List<Payment> payments = paymentRepository.findByPaymentMethod(method);
        
        return payments.stream()
                .map(paymentMapper::paymentToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByPayerIdAndStatus(Long payerId, PaymentStatus status) {
        log.info("Fetching payments for payer ID: {} with status: {}", payerId, status);
        
        List<Payment> payments = paymentRepository.findByPayerIdAndStatus(payerId, status);
        
        return payments.stream()
                .map(paymentMapper::paymentToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByReceiverIdAndStatus(Long receiverId, PaymentStatus status) {
        log.info("Fetching payments for receiver ID: {} with status: {}", receiverId, status);
        
        List<Payment> payments = paymentRepository.findByReceiverIdAndStatus(receiverId, status);
        
        return payments.stream()
                .map(paymentMapper::paymentToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByDateRange(LocalDateTime start, LocalDateTime end) {
        log.info("Fetching payments between: {} and {}", start, end);
        
        List<Payment> payments = paymentRepository.findByCreatedAtBetween(start, end);
        
        return payments.stream()
                .map(paymentMapper::paymentToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentResponse processPaymentCallback(String transactionId, PaymentStatus status, String details) {
        log.info("Processing payment callback for transaction ID: {} with status: {}", transactionId, status);
        
        List<Payment> payments = paymentRepository.findByTransactionId(transactionId);
        if (payments.isEmpty()) {
            throw new ResourceNotFoundException("Payment not found with transaction ID: " + transactionId);
        }
        
        // There should only be one payment with this transaction ID
        Payment payment = payments.get(0);
        
        // Update payment
        payment.setStatus(status);
        payment.setPaymentDetails(details);
        
        if (status == PaymentStatus.COMPLETED || status == PaymentStatus.REFUNDED || 
            status == PaymentStatus.PARTIALLY_REFUNDED || status == PaymentStatus.FAILED) {
            payment.setProcessedAt(LocalDateTime.now());
        }
        
        Payment updatedPayment = paymentRepository.save(payment);
        log.info("Payment updated with status: {}", status);
        
        return paymentMapper.paymentToPaymentResponse(updatedPayment);
    }

    @Override
    @Transactional
    public PaymentResponse refundPayment(Long paymentId, String reason) {
        log.info("Initiating refund for payment ID: {}", paymentId);
        
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        
        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new PaymentException("Cannot refund payment that is not in COMPLETED status");
        }
        
        try {
            PaymentResponse response;
            switch (payment.getPaymentMethod()) {
                case CREDIT_CARD:
                    response = creditCardPaymentProcessor.refundCreditCardPayment(payment, payment.getAmount(), reason);
                    break;
                case WECHAT_PAY:
                    response = weChatPayProcessor.refundWeChatPayment(payment, payment.getAmount(), reason);
                    break;
                default:
                    throw new PaymentException("Unsupported payment method for refund: " + payment.getPaymentMethod());
            }
            return response;
        } catch (Exception e) {
            log.error("Refund processing failed", e);
            throw new PaymentException("Refund processing failed: " + e.getMessage(), e);
        }
    }
} 