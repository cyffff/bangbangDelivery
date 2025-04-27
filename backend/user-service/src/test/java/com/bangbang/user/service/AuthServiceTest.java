package com.bangbang.user.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.bangbang.user.dto.LoginRequestDto;
import com.bangbang.user.dto.TokenResponseDto;
import com.bangbang.user.dto.UserProfileDto;
import com.bangbang.user.dto.UserRegistrationDto;
import com.bangbang.user.entity.Role;
import com.bangbang.user.entity.User;
import com.bangbang.user.exception.AuthenticationFailedException;
import com.bangbang.user.exception.InvalidTokenException;
import com.bangbang.user.exception.UserAlreadyExistsException;
import com.bangbang.user.mapper.UserMapper;
import com.bangbang.user.repository.RoleRepository;
import com.bangbang.user.repository.UserRepository;
import com.bangbang.user.security.JwtTokenProvider;
import com.bangbang.user.service.impl.AuthServiceImpl;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private RoleRepository roleRepository;
    
    @Mock
    private UserMapper userMapper;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private JwtTokenProvider tokenProvider;
    
    @Mock
    private Authentication authentication;
    
    @InjectMocks
    private AuthServiceImpl authService;
    
    private UserRegistrationDto registrationDto;
    private User savedUser;
    private UserProfileDto userProfileDto;
    private Role userRole;
    private LoginRequestDto loginRequestDto;
    private TokenResponseDto tokenResponseDto;
    
    @BeforeEach
    void setUp() {
        registrationDto = UserRegistrationDto.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .firstName("Test")
                .lastName("User")
                .phoneNumber("1234567890")
                .build();
        
        userRole = new Role();
        userRole.setId(1L);
        userRole.setName("ROLE_USER");
        
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        
        savedUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .phoneNumber("1234567890")
                .passwordHash("hashedPassword")
                .roles(roles)
                .build();
        
        userProfileDto = UserProfileDto.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .phoneNumber("1234567890")
                .roles(Set.of("ROLE_USER"))
                .build();
        
        loginRequestDto = LoginRequestDto.builder()
                .username("testuser")
                .password("password123")
                .build();
        
        tokenResponseDto = TokenResponseDto.builder()
                .accessToken("test-access-token")
                .refreshToken("test-refresh-token")
                .tokenType("Bearer")
                .expiresIn(3600)
                .build();
    }
    
    @Test
    void registerUser_WhenUserDoesNotExist_ShouldRegisterAndReturnUserProfile() {
        // Arrange
        User unsavedUser = User.builder()
                .username(registrationDto.getUsername())
                .email(registrationDto.getEmail())
                .build();
                
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByName("ROLE_USER")).thenReturn(Optional.of(userRole));
        when(userMapper.userRegistrationDtoToUser(any(UserRegistrationDto.class))).thenReturn(unsavedUser);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(userMapper.userToUserProfileDto(any(User.class))).thenReturn(userProfileDto);
        
        // Act
        UserProfileDto result = authService.registerUser(registrationDto);
        
        // Assert
        assertNotNull(result);
        assertEquals(userProfileDto.getId(), result.getId());
        assertEquals(userProfileDto.getUsername(), result.getUsername());
        
        // Verify
        verify(userRepository).existsByUsername(registrationDto.getUsername());
        verify(userRepository).existsByEmail(registrationDto.getEmail());
        verify(roleRepository).findByName("ROLE_USER");
        verify(userMapper).userRegistrationDtoToUser(registrationDto);
        verify(passwordEncoder).encode(registrationDto.getPassword());
        verify(userRepository).save(any(User.class));
        verify(userMapper).userToUserProfileDto(savedUser);
    }
    
    @Test
    void registerUser_WhenUsernameExists_ShouldThrowUserAlreadyExistsException() {
        // Arrange
        when(userRepository.existsByUsername(anyString())).thenReturn(true);
        
        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> authService.registerUser(registrationDto));
        
        // Verify
        verify(userRepository).existsByUsername(registrationDto.getUsername());
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userMapper, never()).userRegistrationDtoToUser(any(UserRegistrationDto.class));
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void registerUser_WhenEmailExists_ShouldThrowUserAlreadyExistsException() {
        // Arrange
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        
        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> authService.registerUser(registrationDto));
        
        // Verify
        verify(userRepository).existsByUsername(registrationDto.getUsername());
        verify(userRepository).existsByEmail(registrationDto.getEmail());
        verify(userMapper, never()).userRegistrationDtoToUser(any(UserRegistrationDto.class));
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void login_WhenCredentialsAreValid_ShouldReturnTokens() {
        // Arrange
        when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(authentication);
        when(tokenProvider.generateToken(any(Authentication.class))).thenReturn(tokenResponseDto);
        
        // Act
        TokenResponseDto result = authService.login(loginRequestDto);
        
        // Assert
        assertNotNull(result);
        assertEquals(tokenResponseDto.getAccessToken(), result.getAccessToken());
        assertEquals(tokenResponseDto.getRefreshToken(), result.getRefreshToken());
        
        // Verify
        verify(authenticationManager).authenticate(any(Authentication.class));
        verify(tokenProvider).generateToken(authentication);
    }
    
    @Test
    void login_WhenAuthenticationFails_ShouldThrowAuthenticationFailedException() {
        // Arrange
        when(authenticationManager.authenticate(any(Authentication.class))).thenThrow(new RuntimeException("Authentication failed"));
        
        // Act & Assert
        assertThrows(AuthenticationFailedException.class, () -> authService.login(loginRequestDto));
        
        // Verify
        verify(authenticationManager).authenticate(any(Authentication.class));
        verify(tokenProvider, never()).generateToken(any(Authentication.class));
    }
    
    @Test
    void validateToken_ShouldDelegateToTokenProvider() {
        // Arrange
        String token = "valid-token";
        when(tokenProvider.validateToken(anyString())).thenReturn(true);
        
        // Act
        boolean result = authService.validateToken(token);
        
        // Assert
        assertTrue(result);
        
        // Verify
        verify(tokenProvider).validateToken(token);
    }
    
    @Test
    void refreshToken_WhenTokenIsValid_ShouldReturnNewTokens() {
        // Arrange
        String refreshToken = "valid-refresh-token";
        when(tokenProvider.validateRefreshToken(anyString())).thenReturn(true);
        when(tokenProvider.generateTokenFromRefreshToken(anyString())).thenReturn(tokenResponseDto);
        
        // Act
        TokenResponseDto result = authService.refreshToken(refreshToken);
        
        // Assert
        assertNotNull(result);
        assertEquals(tokenResponseDto.getAccessToken(), result.getAccessToken());
        
        // Verify
        verify(tokenProvider).validateRefreshToken(refreshToken);
        verify(tokenProvider).generateTokenFromRefreshToken(refreshToken);
    }
    
    @Test
    void refreshToken_WhenTokenIsInvalid_ShouldThrowInvalidTokenException() {
        // Arrange
        String refreshToken = "invalid-refresh-token";
        when(tokenProvider.validateRefreshToken(anyString())).thenReturn(false);
        
        // Act & Assert
        assertThrows(InvalidTokenException.class, () -> authService.refreshToken(refreshToken));
        
        // Verify
        verify(tokenProvider).validateRefreshToken(refreshToken);
        verify(tokenProvider, never()).generateTokenFromRefreshToken(anyString());
    }
    
    @Test
    void logout_ShouldInvalidateTokens() {
        // Arrange
        Long userId = 1L;
        doNothing().when(tokenProvider).invalidateTokens(anyLong());
        
        // Act
        authService.logout(userId);
        
        // Verify
        verify(tokenProvider).invalidateTokens(userId);
    }
} 