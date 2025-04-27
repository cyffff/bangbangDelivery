package com.bangbang.journey.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class JourneyNotFoundException extends RuntimeException {
    
    public JourneyNotFoundException(String message) {
        super(message);
    }
    
    public JourneyNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
} 