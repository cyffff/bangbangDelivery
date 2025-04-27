package com.bangbang.user.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.bangbang.user.security.UserPrincipal;
import com.bangbang.user.service.impl.SecurityServiceImpl;

@ExtendWith(MockitoExtension.class)
public class SecurityServiceTest {

    @InjectMocks
    private SecurityServiceImpl securityService;
    
    @Mock
    private SecurityContext securityContext;
    
    @Mock
    private Authentication authentication;
    
    private UserPrincipal userPrincipal;
    
    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);
        
        userPrincipal = UserPrincipal.builder()
                .id(1L)
                .username("testuser")
                .build();
    }
    
    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }
    
    @Test
    void isCurrentUser_WithMatchingUserId_ShouldReturnTrue() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        
        // Act
        boolean result = securityService.isCurrentUser(1L);
        
        // Assert
        assertTrue(result);
    }
    
    @Test
    void isCurrentUser_WithNonMatchingUserId_ShouldReturnFalse() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        
        // Act
        boolean result = securityService.isCurrentUser(2L);
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void isCurrentUser_WithNullUserId_ShouldReturnFalse() {
        // Act
        boolean result = securityService.isCurrentUser(null);
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void isCurrentUser_WithNullAuthentication_ShouldReturnFalse() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(null);
        
        // Act
        boolean result = securityService.isCurrentUser(1L);
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void isCurrentUser_WithUnauthenticated_ShouldReturnFalse() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(false);
        
        // Act
        boolean result = securityService.isCurrentUser(1L);
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void isCurrentUser_WithNonUserPrincipal_ShouldReturnFalse() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("not a UserPrincipal");
        
        // Act
        boolean result = securityService.isCurrentUser(1L);
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void isCurrentUsername_WithMatchingUsername_ShouldReturnTrue() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        
        // Act
        boolean result = securityService.isCurrentUsername("testuser");
        
        // Assert
        assertTrue(result);
    }
    
    @Test
    void isCurrentUsername_WithNonMatchingUsername_ShouldReturnFalse() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        
        // Act
        boolean result = securityService.isCurrentUsername("otheruser");
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void isCurrentUsername_WithNullUsername_ShouldReturnFalse() {
        // Act
        boolean result = securityService.isCurrentUsername(null);
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void isCurrentUsername_WithNullAuthentication_ShouldReturnFalse() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(null);
        
        // Act
        boolean result = securityService.isCurrentUsername("testuser");
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void isCurrentUsername_WithUnauthenticated_ShouldReturnFalse() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(false);
        
        // Act
        boolean result = securityService.isCurrentUsername("testuser");
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void isCurrentUsername_WithNonUserPrincipal_ShouldReturnFalse() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("not a UserPrincipal");
        
        // Act
        boolean result = securityService.isCurrentUsername("testuser");
        
        // Assert
        assertFalse(result);
    }
} 