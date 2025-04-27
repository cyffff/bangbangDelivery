package com.bangbang.payment.controller;

import com.bangbang.payment.dto.PaymentRequest;
import com.bangbang.payment.dto.PaymentResponse;
import com.bangbang.payment.model.PaymentMethod;
import com.bangbang.payment.model.PaymentStatus;
import com.bangbang.payment.service.PaymentService;
import com.bangbang.payment.service.WeChatPayProcessor;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    
    private final PaymentService paymentService;
    private final WeChatPayProcessor weChatPayProcessor;

    @PostMapping
    public ResponseEntity<PaymentResponse> initiatePayment(@Valid @RequestBody PaymentRequest paymentRequest) {
        log.info("Received request to initiate payment for order ID: {}", paymentRequest.getOrderId());
        PaymentResponse paymentResponse = paymentService.initiatePayment(paymentRequest);
        return new ResponseEntity<>(paymentResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        log.info("Received request to get payment with ID: {}", id);
        PaymentResponse paymentResponse = paymentService.getPaymentById(id);
        return ResponseEntity.ok(paymentResponse);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByOrderId(@PathVariable Long orderId) {
        log.info("Received request to get payments for order ID: {}", orderId);
        List<PaymentResponse> payments = paymentService.getPaymentsByOrderId(orderId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/payer/{payerId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByPayerId(@PathVariable Long payerId) {
        log.info("Received request to get payments for payer ID: {}", payerId);
        List<PaymentResponse> payments = paymentService.getPaymentsByPayerId(payerId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByReceiverId(@PathVariable Long receiverId) {
        log.info("Received request to get payments for receiver ID: {}", receiverId);
        List<PaymentResponse> payments = paymentService.getPaymentsByReceiverId(receiverId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByStatus(@PathVariable PaymentStatus status) {
        log.info("Received request to get payments with status: {}", status);
        List<PaymentResponse> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/method/{method}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByMethod(@PathVariable PaymentMethod method) {
        log.info("Received request to get payments with method: {}", method);
        List<PaymentResponse> payments = paymentService.getPaymentsByMethod(method);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/payer/{payerId}/status/{status}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByPayerIdAndStatus(
            @PathVariable Long payerId, 
            @PathVariable PaymentStatus status) {
        log.info("Received request to get payments for payer ID: {} with status: {}", payerId, status);
        List<PaymentResponse> payments = paymentService.getPaymentsByPayerIdAndStatus(payerId, status);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/receiver/{receiverId}/status/{status}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByReceiverIdAndStatus(
            @PathVariable Long receiverId, 
            @PathVariable PaymentStatus status) {
        log.info("Received request to get payments for receiver ID: {} with status: {}", receiverId, status);
        List<PaymentResponse> payments = paymentService.getPaymentsByReceiverIdAndStatus(receiverId, status);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        log.info("Received request to get payments between: {} and {}", start, end);
        List<PaymentResponse> payments = paymentService.getPaymentsByDateRange(start, end);
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/callback")
    public ResponseEntity<PaymentResponse> processPaymentCallback(
            @RequestParam String transactionId,
            @RequestParam PaymentStatus status,
            @RequestParam(required = false) String details) {
        log.info("Received payment callback for transaction ID: {} with status: {}", transactionId, status);
        PaymentResponse paymentResponse = paymentService.processPaymentCallback(transactionId, status, details);
        return ResponseEntity.ok(paymentResponse);
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<PaymentResponse> refundPayment(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        log.info("Received request to refund payment with ID: {}", id);
        PaymentResponse paymentResponse = paymentService.refundPayment(id, reason);
        return ResponseEntity.ok(paymentResponse);
    }
    
    // WeChat Pay specific endpoints
    
    @PostMapping("/wechat/qrcode/{paymentId}")
    public ResponseEntity<Map<String, String>> generateWeChatQRCode(
            @PathVariable Long paymentId,
            @RequestBody(required = false) Map<String, String> details) {
        log.info("Received request to generate WeChat Pay QR code for payment ID: {}", paymentId);
        
        PaymentResponse payment = paymentService.getPaymentById(paymentId);
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        
        String qrCode = null;
        // This would require proper implementation with actual payment details
        // qrCode = weChatPayProcessor.generateQRCode(...);
        
        Map<String, String> response = Map.of("qrCodeUrl", "weixin://wxpay/bizpayurl?pr=G9ktX3W_" + paymentId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/wechat/notify")
    public ResponseEntity<String> weChatPayNotify(@RequestBody String notifyData) {
        log.info("Received WeChat Pay notification");
        
        // In a real implementation, you would:
        // 1. Verify the notification signature using the WeChat Pay API
        // 2. Parse the notification XML
        // 3. Update the payment status
        // 4. Return a specific XML response format expected by WeChat Pay
        
        return ResponseEntity.ok("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
    }
} 