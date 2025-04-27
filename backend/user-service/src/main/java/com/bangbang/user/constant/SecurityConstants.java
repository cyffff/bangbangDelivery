package com.bangbang.user.constant;

public class SecurityConstants {
    
    // JWT Token defaults
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    
    // Default role constants
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_DELIVERER = "ROLE_DELIVERER";
    
    // Default admin user
    public static final String DEFAULT_ADMIN_USERNAME = "admin";
    public static final String DEFAULT_ADMIN_EMAIL = "admin@bangbangdelivery.com";
    public static final String DEFAULT_ADMIN_PASSWORD = "adminPassword123";
    
    private SecurityConstants() {
        // Private constructor to prevent instantiation
    }
} 