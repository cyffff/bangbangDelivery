package com.bangbang.user.service;

/**
 * Service interface for security-related operations.
 * Used primarily for method security expressions in @PreAuthorize annotations.
 */
public interface SecurityService {
    
    /**
     * Check if the authenticated user is the specified user.
     *
     * @param userId the user ID to check
     * @return true if the authenticated user has the given ID
     */
    boolean isCurrentUser(Long userId);
    
    /**
     * Check if the authenticated user has the specified username.
     *
     * @param username the username to check
     * @return true if the authenticated user has the given username
     */
    boolean isCurrentUsername(String username);
} 