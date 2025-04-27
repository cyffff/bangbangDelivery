package com.bangbang.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

/**
 * Configuration properties for JWT settings.
 * Values are loaded from application.yml under app.jwt prefix.
 */
@Configuration
@ConfigurationProperties(prefix = "app.jwt")
@Data
public class JwtConfig {
    
    /**
     * Secret key used for signing JWT tokens.
     */
    private String secret;
    
    /**
     * Access token expiration time in milliseconds.
     */
    private long expiration;
    
    /**
     * Refresh token expiration time in milliseconds.
     */
    private long refreshExpiration;
} 