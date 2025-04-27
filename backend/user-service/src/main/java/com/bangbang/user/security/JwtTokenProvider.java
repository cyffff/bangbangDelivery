package com.bangbang.user.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import com.bangbang.user.config.JwtConfig;
import com.bangbang.user.dto.TokenResponseDto;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenProvider {

    private final JwtConfig jwtConfig;
    private final JwtUtils jwtUtils;
    
    // Store for invalidated tokens
    private final Map<Long, Map<String, Date>> invalidatedTokens = new ConcurrentHashMap<>();

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());
    }

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
    
    public TokenResponseDto generateTokenFromRefreshToken(String refreshToken) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(refreshToken)
                .getBody();
        
        Long userId = Long.parseLong(claims.getSubject());
        
        // Generate new tokens for the user
        UserPrincipal userPrincipal = UserPrincipal.builder()
                .id(userId)
                .build();
        
        Authentication authentication = new JwtAuthentication(userPrincipal);
        
        return generateToken(authentication);
    }

    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        if (!jwtUtils.validateToken(authToken)) {
            return false;
        }
        
        // Check if token has been invalidated
        try {
            Long userId = getUserIdFromJWT(authToken);
            return !isTokenInvalidated(userId, authToken);
        } catch (Exception e) {
            log.error("Error validating token", e);
            return false;
        }
    }
    
    public boolean validateRefreshToken(String refreshToken) {
        return jwtUtils.validateToken(refreshToken) && !isRefreshTokenInvalidated(refreshToken);
    }
    
    public void invalidateTokens(Long userId) {
        // Add tokens to invalidated list
        invalidatedTokens.computeIfAbsent(userId, k -> new ConcurrentHashMap<>())
            .put("ALL", new Date());
    }
    
    private boolean isRefreshTokenInvalidated(String refreshToken) {
        try {
            Long userId = getUserIdFromJWT(refreshToken);
            return isTokenInvalidated(userId, refreshToken);
        } catch (Exception e) {
            log.error("Error checking if refresh token is invalidated", e);
            return true;
        }
    }
    
    private boolean isTokenInvalidated(Long userId, String token) {
        Map<String, Date> userInvalidatedTokens = invalidatedTokens.get(userId);
        if (userInvalidatedTokens == null) {
            return false;
        }
        
        // Check if this specific token or all tokens for this user are invalidated
        Date invalidationDate = userInvalidatedTokens.get(token);
        if (invalidationDate == null) {
            invalidationDate = userInvalidatedTokens.get("ALL");
        }
        
        if (invalidationDate != null) {
            Date tokenIssuedAt = jwtUtils.extractIssuedAt(token);
            return tokenIssuedAt == null || tokenIssuedAt.before(invalidationDate);
        }
        
        return false;
    }
} 