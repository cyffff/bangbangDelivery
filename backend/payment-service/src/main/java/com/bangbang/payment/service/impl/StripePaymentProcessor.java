package com.bangbang.payment.service.impl;

import com.bangbang.payment.dto.CreditCardDetails;
import com.bangbang.payment.dto.PaymentResponse;
import com.bangbang.payment.exception.PaymentException;
import com.bangbang.payment.mapper.PaymentMapper;
import com.bangbang.payment.model.Payment;
import com.bangbang.payment.model.PaymentStatus;
import com.bangbang.payment.repository.PaymentRepository;
import com.bangbang.payment.service.CreditCardPaymentProcessor;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Refund;
import com.stripe.model.Token;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripePaymentProcessor implements CreditCardPaymentProcessor {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    
    @Value("${stripe.api.key}")
    private String stripeApiKey;
    
    @Value("${stripe.webhook.secret}")
    private String webhookSecret;
    
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    @Transactional
    public PaymentResponse processCreditCardPayment(Payment payment, CreditCardDetails cardDetails) {
        log.info("Processing credit card payment for payment ID: {}", payment.getId());
        
        try {
            // Create a Stripe token with card details
            Map<String, Object> cardParams = new HashMap<>();
            cardParams.put("number", cardDetails.getCardNumber());
            cardParams.put("exp_month", cardDetails.getExpirationMonth());
            cardParams.put("exp_year", cardDetails.getExpirationYear());
            cardParams.put("cvc", cardDetails.getCvv());
            
            Map<String, Object> tokenParams = new HashMap<>();
            tokenParams.put("card", cardParams);
            
            Token token = Token.create(tokenParams);
            
            // Create a charge
            Map<String, Object> chargeParams = new HashMap<>();
            // Convert BigDecimal to cents (Stripe uses smallest currency unit)
            long amountInCents = payment.getAmount().multiply(new BigDecimal("100")).longValue();
            chargeParams.put("amount", amountInCents);
            chargeParams.put("currency", "usd");
            chargeParams.put("source", token.getId());
            chargeParams.put("description", "Payment for Order ID: " + payment.getOrderId());
            
            // Add metadata
            Map<String, String> metadata = new HashMap<>();
            metadata.put("order_id", payment.getOrderId().toString());
            metadata.put("payment_id", payment.getId().toString());
            chargeParams.put("metadata", metadata);
            
            Charge charge = Charge.create(chargeParams);
            
            // Update payment with Stripe details
            payment.setTransactionId(charge.getId());
            payment.setPaymentDetails("Stripe Charge ID: " + charge.getId());
            
            if (charge.getPaid()) {
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setProcessedAt(LocalDateTime.now());
            } else {
                payment.setStatus(PaymentStatus.PROCESSING);
            }
            
            Payment updatedPayment = paymentRepository.save(payment);
            log.info("Credit card payment processed successfully with Stripe Charge ID: {}", charge.getId());
            
            return paymentMapper.paymentToPaymentResponseWithRedirect(
                    updatedPayment, 
                    null, // No redirect needed for credit card
                    charge.getId() // Client secret for client-side confirmation
            );
        } catch (StripeException e) {
            log.error("Stripe payment processing failed", e);
            payment.setStatus(PaymentStatus.FAILED);
            payment.setPaymentDetails("Error: " + e.getMessage());
            paymentRepository.save(payment);
            throw new PaymentException("Credit card payment failed: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public PaymentResponse refundCreditCardPayment(Payment payment, BigDecimal amount, String reason) {
        log.info("Processing refund for payment ID: {} with Stripe Charge ID: {}", 
                payment.getId(), payment.getTransactionId());
        
        try {
            // Create refund request to Stripe
            Map<String, Object> refundParams = new HashMap<>();
            refundParams.put("charge", payment.getTransactionId());
            
            // If the amount is the same as the original charge, do a full refund
            if (amount.compareTo(payment.getAmount()) < 0) {
                // Partial refund
                long amountInCents = amount.multiply(new BigDecimal("100")).longValue();
                refundParams.put("amount", amountInCents);
                refundParams.put("reason", "requested_by_customer");
                if (reason != null && !reason.isEmpty()) {
                    Map<String, String> metadata = new HashMap<>();
                    metadata.put("reason", reason);
                    refundParams.put("metadata", metadata);
                }
            }
            
            Refund refund = Refund.create(refundParams);
            
            // Update payment status
            if (amount.compareTo(payment.getAmount()) == 0) {
                payment.setStatus(PaymentStatus.REFUNDED);
            } else {
                payment.setStatus(PaymentStatus.PARTIALLY_REFUNDED);
            }
            
            payment.setPaymentDetails(payment.getPaymentDetails() + 
                    "; Refunded: " + refund.getId() + 
                    "; Amount: " + amount + 
                    "; Reason: " + reason);
            
            payment.setProcessedAt(LocalDateTime.now());
            
            Payment updatedPayment = paymentRepository.save(payment);
            log.info("Refund processed successfully with Stripe Refund ID: {}", refund.getId());
            
            return paymentMapper.paymentToPaymentResponse(updatedPayment);
        } catch (StripeException e) {
            log.error("Stripe refund processing failed", e);
            throw new PaymentException("Credit card refund failed: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public PaymentResponse verifyCreditCardPayment(String transactionId) {
        log.info("Verifying credit card payment with Stripe Charge ID: {}", transactionId);
        
        try {
            Charge charge = Charge.retrieve(transactionId);
            
            // Find the payment by transaction ID
            List<Payment> payments = paymentRepository.findByTransactionId(transactionId);
            if (payments.isEmpty()) {
                throw new ResourceNotFoundException("Payment not found with transaction ID: " + transactionId);
            }
            
            Payment payment = payments.get(0);
            
            // Update payment status based on Stripe status
            if (charge.getPaid() && !charge.getRefunded()) {
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setProcessedAt(LocalDateTime.now());
            } else if (charge.getRefunded()) {
                payment.setStatus(PaymentStatus.REFUNDED);
                payment.setProcessedAt(LocalDateTime.now());
            } else if (charge.getStatus().equals("failed")) {
                payment.setStatus(PaymentStatus.FAILED);
            }
            
            Payment updatedPayment = paymentRepository.save(payment);
            log.info("Credit card payment verification completed with status: {}", updatedPayment.getStatus());
            
            return paymentMapper.paymentToPaymentResponse(updatedPayment);
        } catch (StripeException e) {
            log.error("Stripe verification failed", e);
            throw new PaymentException("Credit card payment verification failed: " + e.getMessage(), e);
        }
    }
} 