package com.bangbang.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for JWT token responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponseDto {

    /**
     * JWT access token.
     */
    private String accessToken;

    /**
     * JWT refresh token.
     */
    private String refreshToken;

    /**
     * Token type (e.g., "Bearer").
     */
    private String tokenType;

    /**
     * Expiration time in seconds.
     */
    private long expiresIn;

    /**
     * User profile information.
     */
    private UserProfileDto user;
} 