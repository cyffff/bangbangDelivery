package com.bangbang.matching.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidMatchStateException extends RuntimeException {
    
    public InvalidMatchStateException(String message) {
        super(message);
    }
    
    public InvalidMatchStateException(String message, Throwable cause) {
        super(message, cause);
    }
} 