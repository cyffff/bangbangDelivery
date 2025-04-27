package com.bangbang.user.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import com.bangbang.user.config.JwtConfig;

@ExtendWith(MockitoExtension.class)
public class JwtTokenProviderTest {

    @Mock
    private JwtConfig jwtConfig;
    
    @Mock
    private JwtUtils jwtUtils;
    
    @InjectMocks
    private JwtTokenProvider jwtTokenProvider;
    
    private final String username = "testuser";
    private final String token = "test.token.value";
    private final String refreshToken = "test.refresh.token.value";
    private UserDetails userDetails;
    
    @BeforeEach
    void setUp() {
        // Configure mocks
        when(jwtConfig.getExpiration()).thenReturn(3600000L); // 1 hour
        when(jwtConfig.getRefreshExpiration()).thenReturn(86400000L); // 24 hours
        when(jwtConfig.getSecret()).thenReturn("testSecretKeyLongEnoughToMeetRequirementsForHMACSHA512");
        
        // Create user details
        userDetails = new User(
            username, 
            "password", 
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
    
    @Test
    void generateToken_ShouldReturnTokenAndRefreshToken() {
        // Act
        Map<String, String> tokenMap = jwtTokenProvider.generateToken(userDetails);
        
        // Assert
        assertNotNull(tokenMap);
        assertTrue(tokenMap.containsKey("token"));
        assertTrue(tokenMap.containsKey("refreshToken"));
        assertNotNull(tokenMap.get("token"));
        assertNotNull(tokenMap.get("refreshToken"));
    }
    
    @Test
    void validateToken_WithValidNonInvalidatedToken_ShouldReturnTrue() {
        // Arrange
        when(jwtUtils.validateToken(token)).thenReturn(true);
        
        // Act
        boolean result = jwtTokenProvider.validateToken(token);
        
        // Assert
        assertTrue(result);
        verify(jwtUtils).validateToken(token);
    }
    
    @Test
    void validateToken_WithInvalidToken_ShouldReturnFalse() {
        // Arrange
        when(jwtUtils.validateToken(token)).thenReturn(false);
        
        // Act
        boolean result = jwtTokenProvider.validateToken(token);
        
        // Assert
        assertFalse(result);
        verify(jwtUtils).validateToken(token);
    }
    
    @Test
    void invalidateToken_ShouldAddTokenToInvalidatedTokens() {
        // Arrange
        Date issuedAt = new Date();
        when(jwtUtils.extractIssuedAt(token)).thenReturn(issuedAt);
        
        // Act
        jwtTokenProvider.invalidateToken(token);
        
        // Assert
        boolean result = jwtTokenProvider.isTokenInvalidated(token);
        assertTrue(result);
    }
    
    @Test
    void refreshToken_WithValidRefreshToken_ShouldReturnNewTokens() {
        // Arrange
        when(jwtUtils.validateToken(refreshToken)).thenReturn(true);
        when(jwtUtils.extractUsername(refreshToken)).thenReturn(username);
        
        // Act
        Map<String, String> result = jwtTokenProvider.refreshToken(refreshToken, userDetails);
        
        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("token"));
        assertTrue(result.containsKey("refreshToken"));
    }
    
    @Test
    void refreshToken_WithInvalidRefreshToken_ShouldReturnNull() {
        // Arrange
        when(jwtUtils.validateToken(refreshToken)).thenReturn(false);
        
        // Act
        Map<String, String> result = jwtTokenProvider.refreshToken(refreshToken, userDetails);
        
        // Assert
        assertNull(result);
    }
    
    @Test
    void refreshToken_WithInvalidatedRefreshToken_ShouldReturnNull() {
        // Arrange
        when(jwtUtils.validateToken(refreshToken)).thenReturn(true);
        Date issuedAt = new Date();
        when(jwtUtils.extractIssuedAt(refreshToken)).thenReturn(issuedAt);
        
        // Invalidate the token first
        jwtTokenProvider.invalidateToken(refreshToken);
        
        // Act
        Map<String, String> result = jwtTokenProvider.refreshToken(refreshToken, userDetails);
        
        // Assert
        assertNull(result);
    }
    
    @Test
    void refreshToken_WithDifferentUsername_ShouldReturnNull() {
        // Arrange
        when(jwtUtils.validateToken(refreshToken)).thenReturn(true);
        when(jwtUtils.extractUsername(refreshToken)).thenReturn("different_user");
        
        // Act
        Map<String, String> result = jwtTokenProvider.refreshToken(refreshToken, userDetails);
        
        // Assert
        assertNull(result);
    }
} 