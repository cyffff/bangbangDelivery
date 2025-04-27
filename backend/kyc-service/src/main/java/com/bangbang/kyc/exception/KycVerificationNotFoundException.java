package com.bangbang.kyc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class KycVerificationNotFoundException extends RuntimeException {
    
    public KycVerificationNotFoundException(String message) {
        super(message);
    }
    
    public KycVerificationNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
} 