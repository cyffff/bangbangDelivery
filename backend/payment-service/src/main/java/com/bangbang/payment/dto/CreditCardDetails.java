package com.bangbang.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreditCardDetails {
    
    @NotBlank(message = "Card number is required")
    @Pattern(regexp = "^[0-9]{13,19}$", message = "Invalid card number format")
    private String cardNumber;
    
    @NotBlank(message = "Card holder name is required")
    private String cardHolderName;
    
    @NotBlank(message = "Expiration month is required")
    @Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "Invalid expiration month")
    private String expirationMonth;
    
    @NotBlank(message = "Expiration year is required")
    @Pattern(regexp = "^[0-9]{2}$", message = "Invalid expiration year")
    private String expirationYear;
    
    @NotBlank(message = "CVV is required")
    @Pattern(regexp = "^[0-9]{3,4}$", message = "Invalid CVV")
    private String cvv;
    
    @Size(max = 255, message = "Billing address is too long")
    private String billingAddress;
    
    @Size(max = 50, message = "Postal code is too long")
    private String postalCode;
} 