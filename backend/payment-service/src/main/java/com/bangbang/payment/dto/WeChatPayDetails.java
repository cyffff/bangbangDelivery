package com.bangbang.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeChatPayDetails {
    
    @NotBlank(message = "OpenID is required")
    private String openId;
    
    private String appId;
    
    private String redirectUrl;
} 