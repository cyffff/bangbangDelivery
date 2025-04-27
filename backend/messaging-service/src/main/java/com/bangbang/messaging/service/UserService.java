package com.bangbang.messaging.service;

public interface UserService {
    
    /**
     * Get username by user ID
     * 
     * @param userId the user ID
     * @return the username
     */
    String getUsernameById(Long userId);
    
    /**
     * Check if a user exists
     * 
     * @param userId the user ID
     * @return true if the user exists
     */
    boolean existsById(Long userId);
} 