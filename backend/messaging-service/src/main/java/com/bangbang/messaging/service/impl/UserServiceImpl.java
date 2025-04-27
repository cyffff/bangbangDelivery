package com.bangbang.messaging.service.impl;

import com.bangbang.messaging.client.UserServiceClient;
import com.bangbang.messaging.dto.UserDto;
import com.bangbang.messaging.service.UserService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserServiceClient userServiceClient;
    
    @Override
    @CircuitBreaker(name = "userService", fallbackMethod = "getDefaultUsername")
    public String getUsernameById(Long userId) {
        try {
            UserDto user = userServiceClient.getUserById(userId);
            return user != null ? user.getUsername() : "Unknown User";
        } catch (Exception e) {
            log.error("Error fetching username for user ID: {}", userId, e);
            return getDefaultUsername(userId, e);
        }
    }

    @Override
    @CircuitBreaker(name = "userService", fallbackMethod = "existsByIdFallback")
    public boolean existsById(Long userId) {
        try {
            return userServiceClient.existsById(userId);
        } catch (Exception e) {
            log.error("Error checking if user exists with ID: {}", userId, e);
            return existsByIdFallback(userId, e);
        }
    }
    
    /**
     * Fallback method for getUsernameById
     */
    public String getDefaultUsername(Long userId, Throwable t) {
        log.warn("Using fallback for getUsernameById. User ID: {}, Error: {}", userId, t.getMessage());
        return "User #" + userId;
    }
    
    /**
     * Fallback method for existsById
     */
    public boolean existsByIdFallback(Long userId, Throwable t) {
        log.warn("Using fallback for existsById. User ID: {}, Error: {}", userId, t.getMessage());
        return true; // Assume user exists to avoid breaking functionality
    }
} 