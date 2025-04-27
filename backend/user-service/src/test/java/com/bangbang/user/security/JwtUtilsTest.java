package com.bangbang.user.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.bangbang.user.config.JwtConfig;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@ExtendWith(MockitoExtension.class)
public class JwtUtilsTest {

    @Mock
    private JwtConfig jwtConfig;
    
    @InjectMocks
    private JwtUtils jwtUtils;
    
    private String validToken;
    private String expiredToken;
    private String invalidToken;
    private final String secret = "testSecretKeyLongEnoughToMeetRequirementsForHMACSHA512";
    private final String subject = "testUser";
    
    @BeforeEach
    void setUp() {
        // Mock config
        when(jwtConfig.getSecret()).thenReturn(secret);
        
        // Generate valid token
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 3600000); // 1 hour later
        
        validToken = Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS512)
                .compact();
        
        // Generate expired token
        Date pastDate = new Date(now.getTime() - 3600000); // 1 hour ago
        
        expiredToken = Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(pastDate)
                .setExpiration(pastDate)
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS512)
                .compact();
        
        // Invalid token
        invalidToken = "invalid.token.format";
    }
    
    @Test
    void extractAllClaims_ShouldReturnAllClaims() {
        // Act
        Claims claims = jwtUtils.extractAllClaims(validToken);
        
        // Assert
        assertNotNull(claims);
        assertEquals(subject, claims.getSubject());
    }
    
    @Test
    void extractUsername_ShouldReturnUsername() {
        // Act
        String username = jwtUtils.extractUsername(validToken);
        
        // Assert
        assertEquals(subject, username);
    }
    
    @Test
    void extractExpiration_ShouldReturnExpirationDate() {
        // Act
        Date expiration = jwtUtils.extractExpiration(validToken);
        
        // Assert
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }
    
    @Test
    void isTokenExpired_WithValidToken_ShouldReturnFalse() {
        // Act
        boolean expired = jwtUtils.isTokenExpired(validToken);
        
        // Assert
        assertFalse(expired);
    }
    
    @Test
    void isTokenExpired_WithExpiredToken_ShouldReturnTrue() {
        // Act
        boolean expired = jwtUtils.isTokenExpired(expiredToken);
        
        // Assert
        assertTrue(expired);
    }
    
    @Test
    void validateToken_WithValidToken_ShouldReturnTrue() {
        // Act
        boolean valid = jwtUtils.validateToken(validToken);
        
        // Assert
        assertTrue(valid);
    }
    
    @Test
    void validateToken_WithExpiredToken_ShouldReturnFalse() {
        // Act
        boolean valid = jwtUtils.validateToken(expiredToken);
        
        // Assert
        assertFalse(valid);
    }
    
    @Test
    void validateToken_WithInvalidToken_ShouldReturnFalse() {
        // Act
        boolean valid = jwtUtils.validateToken(invalidToken);
        
        // Assert
        assertFalse(valid);
    }
} 