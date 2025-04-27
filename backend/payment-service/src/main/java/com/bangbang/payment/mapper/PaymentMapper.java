package com.bangbang.payment.mapper;

import com.bangbang.payment.dto.PaymentRequest;
import com.bangbang.payment.dto.PaymentResponse;
import com.bangbang.payment.model.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fee", ignore = true)
    @Mapping(target = "netAmount", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "transactionId", ignore = true)
    @Mapping(target = "paymentDetails", ignore = true)
    @Mapping(target = "processedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Payment paymentRequestToPayment(PaymentRequest paymentRequest);
    
    @Mapping(target = "redirectUrl", ignore = true)
    @Mapping(target = "clientSecret", ignore = true)
    PaymentResponse paymentToPaymentResponse(Payment payment);
    
    @Mapping(target = "redirectUrl", source = "redirectUrl")
    @Mapping(target = "clientSecret", source = "clientSecret")
    PaymentResponse paymentToPaymentResponseWithRedirect(Payment payment, String redirectUrl, String clientSecret);
} 