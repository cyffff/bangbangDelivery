package com.bangbang.payment.service.impl;

import com.bangbang.payment.dto.PaymentResponse;
import com.bangbang.payment.dto.WeChatPayDetails;
import com.bangbang.payment.exception.PaymentException;
import com.bangbang.payment.exception.ResourceNotFoundException;
import com.bangbang.payment.mapper.PaymentMapper;
import com.bangbang.payment.model.Payment;
import com.bangbang.payment.model.PaymentStatus;
import com.bangbang.payment.repository.PaymentRepository;
import com.bangbang.payment.service.WeChatPayProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeChatPayProcessorImpl implements WeChatPayProcessor {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    
    @Value("${wechat.pay.appId:wxd930ea5d5a258f4f}")
    private String appId;
    
    @Value("${wechat.pay.mchId:1230000109}")
    private String mchId;
    
    @Value("${wechat.pay.key:192006250b4c09247ec02edce69f6a2d}")
    private String key;
    
    @Value("${wechat.pay.notifyUrl:https://api.bangbang.com/payment/wechat/notify}")
    private String notifyUrl;

    @Override
    @Transactional
    public PaymentResponse processWeChatPayment(Payment payment, WeChatPayDetails weChatPayDetails) {
        log.info("Processing WeChat Pay payment for payment ID: {}", payment.getId());
        
        try {
            // For demo purposes, we're simulating the WeChat Pay API call
            // In a real application, you would use the WeChat Pay SDK
            
            // Create unique order ID for WeChat Pay
            String outTradeNo = "BangBang_" + payment.getId() + "_" + UUID.randomUUID().toString().substring(0, 8);
            
            // Simulate response from WeChat Pay API
            Map<String, String> resp = new HashMap<>();
            resp.put("return_code", "SUCCESS");
            resp.put("result_code", "SUCCESS");
            resp.put("prepay_id", "wx201410272009395522657a690389285100");
            resp.put("code_url", "weixin://wxpay/bizpayurl?pr=G9ktX3W");
            
            // Update payment record
            payment.setTransactionId(outTradeNo);
            payment.setStatus(PaymentStatus.PENDING);
            payment.setPaymentDetails("WeChat Pay Order: Prepay ID=" + resp.get("prepay_id"));
            
            Payment updatedPayment = paymentRepository.save(payment);
            log.info("WeChat Pay payment initiated successfully with transaction ID: {}", outTradeNo);
            
            // Return redirect URL or QR code URL based on OpenID availability
            String redirectUrl = null;
            String codeUrl = resp.get("code_url");
            
            if (weChatPayDetails.getOpenId() != null && !weChatPayDetails.getOpenId().isEmpty()) {
                // For JSAPI payments, redirect to frontend with prepay_id
                String prepayId = resp.get("prepay_id");
                redirectUrl = buildJsapiRedirectUrl(weChatPayDetails.getRedirectUrl(), prepayId);
            }
            
            return paymentMapper.paymentToPaymentResponseWithRedirect(
                    updatedPayment, 
                    redirectUrl, 
                    codeUrl
            );
        } catch (Exception e) {
            log.error("WeChat Pay processing failed", e);
            payment.setStatus(PaymentStatus.FAILED);
            payment.setPaymentDetails("Error: " + e.getMessage());
            paymentRepository.save(payment);
            throw new PaymentException("WeChat Pay payment failed: " + e.getMessage(), e);
        }
    }

    private String buildJsapiRedirectUrl(String baseUrl, String prepayId) {
        if (baseUrl == null || baseUrl.isEmpty()) {
            return null;
        }
        return baseUrl + "?prepay_id=" + prepayId;
    }

    @Override
    @Transactional
    public PaymentResponse refundWeChatPayment(Payment payment, BigDecimal amount, String reason) {
        log.info("Processing WeChat Pay refund for payment ID: {} with transaction ID: {}", 
                payment.getId(), payment.getTransactionId());
        
        try {
            // For demo purposes, we're simulating the WeChat Pay refund API call
            
            // Create unique refund ID
            String outRefundNo = "REFUND_" + payment.getId() + "_" + UUID.randomUUID().toString().substring(0, 8);
            
            // Simulate successful refund
            
            // Update payment status
            if (amount.compareTo(payment.getAmount()) == 0) {
                payment.setStatus(PaymentStatus.REFUNDED);
            } else {
                payment.setStatus(PaymentStatus.PARTIALLY_REFUNDED);
            }
            
            payment.setPaymentDetails(payment.getPaymentDetails() + 
                    "; Refunded: " + outRefundNo + 
                    "; Amount: " + amount + 
                    "; Reason: " + reason);
            
            payment.setProcessedAt(LocalDateTime.now());
            
            Payment updatedPayment = paymentRepository.save(payment);
            log.info("WeChat Pay refund processed successfully with refund ID: {}", outRefundNo);
            
            return paymentMapper.paymentToPaymentResponse(updatedPayment);
        } catch (Exception e) {
            log.error("WeChat Pay refund processing failed", e);
            throw new PaymentException("WeChat Pay refund failed: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public PaymentResponse verifyWeChatPayment(String transactionId) {
        log.info("Verifying WeChat Pay payment with transaction ID: {}", transactionId);
        
        try {
            // For demo purposes, we're simulating the WeChat Pay order query API call
            
            // Find the payment by transaction ID
            List<Payment> payments = paymentRepository.findByTransactionId(transactionId);
            if (payments.isEmpty()) {
                throw new ResourceNotFoundException("Payment not found with transaction ID: " + transactionId);
            }
            
            Payment payment = payments.get(0);
            
            // Simulate successful payment
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setProcessedAt(LocalDateTime.now());
            payment.setPaymentDetails(payment.getPaymentDetails() + 
                    "; Verification: Payment completed successfully");
            
            Payment updatedPayment = paymentRepository.save(payment);
            log.info("WeChat Pay payment verification completed with status: {}", updatedPayment.getStatus());
            
            return paymentMapper.paymentToPaymentResponse(updatedPayment);
        } catch (Exception e) {
            log.error("WeChat Pay verification failed", e);
            throw new PaymentException("WeChat Pay payment verification failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateQRCode(Payment payment, WeChatPayDetails weChatPayDetails) {
        try {
            // For demo purposes, we're simulating the QR code generation
            
            // Create unique order ID for WeChat Pay
            String outTradeNo = "BangBang_" + payment.getId() + "_" + UUID.randomUUID().toString().substring(0, 8);
            
            // Update transaction ID in payment record
            payment.setTransactionId(outTradeNo);
            paymentRepository.save(payment);
            
            // Return a mock QR code URL
            return "weixin://wxpay/bizpayurl?pr=G9ktX3W_" + outTradeNo;
        } catch (Exception e) {
            log.error("WeChat Pay QR code generation failed", e);
            throw new PaymentException("Failed to generate WeChat Pay QR code: " + e.getMessage(), e);
        }
    }
} 