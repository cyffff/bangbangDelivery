package com.bangbang.auth.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import com.bangbang.auth.config.JwtConfig;
import com.bangbang.auth.dto.TokenResponseDto;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Provider class for generating and validating JWT tokens.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenProvider {

    private final JwtConfig jwtConfig;
    
    // Store for invalidated tokens
    private final Map<Long, Map<String, Date>> invalidatedTokens = new ConcurrentHashMap<>();

    /**
     * Get the signing key for JWT tokens.
     *
     * @return the signing key
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());
    }

    /**
     * Generate JWT tokens for an authenticated user.
     *
     * @param authentication the authentication object
     * @return the token response containing access and refresh tokens
     */
    public TokenResponseDto generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Date now = new Date();
        Date accessTokenExpiryDate = new Date(now.getTime() + jwtConfig.getExpiration());
        Date refreshTokenExpiryDate = new Date(now.getTime() + jwtConfig.getRefreshExpiration());
        
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", authorities);
        
        String accessToken = Jwts.builder()
                .setClaims(claims)
                .setSubject(userPrincipal.getId().toString())
                .setIssuedAt(now)
                .setExpiration(accessTokenExpiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
        
        String refreshToken = Jwts.builder()
                .setSubject(userPrincipal.getId().toString())
                .setIssuedAt(now)
                .setExpiration(refreshTokenExpiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
        
        return TokenResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtConfig.getExpiration() / 1000)
                .build();
    }
    
    /**
     * Generate new tokens from a refresh token.
     *
     * @param refreshToken the refresh token
     * @return the token response containing new access and refresh tokens
     */
    public TokenResponseDto generateTokenFromRefreshToken(String refreshToken) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(refreshToken)
                .getBody();
        
        Long userId = Long.parseLong(claims.getSubject());
        
        // Generate new tokens for the user
        Date now = new Date();
        Date accessTokenExpiryDate = new Date(now.getTime() + jwtConfig.getExpiration());
        Date refreshTokenExpiryDate = new Date(now.getTime() + jwtConfig.getRefreshExpiration());
        
        String newAccessToken = Jwts.builder()
                .setClaims(claims)
                .setSubject(userId.toString())
                .setIssuedAt(now)
                .setExpiration(accessTokenExpiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
        
        String newRefreshToken = Jwts.builder()
                .setSubject(userId.toString())
                .setIssuedAt(now)
                .setExpiration(refreshTokenExpiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
        
        return TokenResponseDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtConfig.getExpiration() / 1000)
                .build();
    }

    /**
     * Extract the user ID from a JWT token.
     *
     * @param token the JWT token
     * @return the user ID
     */
    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    /**
     * Validate a JWT token.
     *
     * @param authToken the JWT token to validate
     * @return true if the token is valid, false otherwise
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(authToken);
            
            // Check if token has been invalidated
            Long userId = getUserIdFromJWT(authToken);
            return !isTokenInvalidated(userId, authToken);
        } catch (Exception e) {
            log.error("JWT validation error: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Validate a refresh token.
     *
     * @param refreshToken the refresh token to validate
     * @return true if the token is valid, false otherwise
     */
    public boolean validateRefreshToken(String refreshToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(refreshToken);
            
            // Check if token has been invalidated
            Long userId = getUserIdFromJWT(refreshToken);
            return !isTokenInvalidated(userId, refreshToken);
        } catch (Exception e) {
            log.error("Refresh token validation error: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Check if a token has been invalidated.
     *
     * @param userId the user ID
     * @param token the token to check
     * @return true if the token is invalidated, false otherwise
     */
    private boolean isTokenInvalidated(Long userId, String token) {
        Map<String, Date> userTokens = invalidatedTokens.get(userId);
        if (userTokens == null) {
            return false;
        }
        
        if (userTokens.containsKey("ALL")) {
            // All tokens for this user are invalidated
            Date invalidatedAt = userTokens.get("ALL");
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(getSigningKey())
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
                
                Date issuedAt = claims.getIssuedAt();
                return issuedAt.before(invalidatedAt);
            } catch (Exception e) {
                // Error parsing token, consider it invalid
                return true;
            }
        }
        
        return userTokens.containsKey(token);
    }
    
    /**
     * Invalidate all tokens for a user.
     *
     * @param userId the user ID
     */
    public void invalidateTokens(Long userId) {
        // Add tokens to invalidated list
        invalidatedTokens.computeIfAbsent(userId, k -> new ConcurrentHashMap<>())
            .put("ALL", new Date());
    }
} 