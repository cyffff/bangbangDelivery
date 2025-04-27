package com.bangbang.user.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.bangbang.user.dto.LoginRequestDto;
import com.bangbang.user.dto.TokenResponseDto;
import com.bangbang.user.dto.UserProfileDto;
import com.bangbang.user.dto.UserRegistrationDto;
import com.bangbang.user.exception.AuthenticationFailedException;
import com.bangbang.user.exception.UserAlreadyExistsException;
import com.bangbang.user.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private UserRegistrationDto registrationDto;
    private UserProfileDto userProfileDto;
    private LoginRequestDto loginRequestDto;
    private TokenResponseDto tokenResponseDto;

    @BeforeEach
    void setUp() {
        registrationDto = UserRegistrationDto.builder()
                .username("testuser")
                .email("test@example.com")
                .password("Password123")
                .firstName("Test")
                .lastName("User")
                .phoneNumber("1234567890")
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
                .password("Password123")
                .build();

        tokenResponseDto = TokenResponseDto.builder()
                .accessToken("test-access-token")
                .refreshToken("test-refresh-token")
                .tokenType("Bearer")
                .expiresIn(3600)
                .build();
    }

    @Test
    void register_WhenValidInput_ShouldReturnCreatedUserProfile() throws Exception {
        // Arrange
        when(authService.registerUser(any(UserRegistrationDto.class))).thenReturn(userProfileDto);

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(userProfileDto.getId()))
                .andExpect(jsonPath("$.username").value(userProfileDto.getUsername()))
                .andExpect(jsonPath("$.email").value(userProfileDto.getEmail()));
    }

    @Test
    void register_WhenUserAlreadyExists_ShouldReturnConflict() throws Exception {
        // Arrange
        when(authService.registerUser(any(UserRegistrationDto.class)))
                .thenThrow(new UserAlreadyExistsException("Username already exists"));

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationDto)))
                .andExpect(status().isConflict());
    }

    @Test
    void login_WhenValidCredentials_ShouldReturnTokens() throws Exception {
        // Arrange
        when(authService.login(any(LoginRequestDto.class))).thenReturn(tokenResponseDto);

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value(tokenResponseDto.getAccessToken()))
                .andExpect(jsonPath("$.refreshToken").value(tokenResponseDto.getRefreshToken()))
                .andExpect(jsonPath("$.tokenType").value(tokenResponseDto.getTokenType()))
                .andExpect(jsonPath("$.expiresIn").value(tokenResponseDto.getExpiresIn()));
    }

    @Test
    void login_WhenInvalidCredentials_ShouldReturnUnauthorized() throws Exception {
        // Arrange
        when(authService.login(any(LoginRequestDto.class)))
                .thenThrow(new AuthenticationFailedException("Invalid username or password"));

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequestDto)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void refreshToken_WhenValidToken_ShouldReturnNewTokens() throws Exception {
        // Arrange
        String refreshToken = "valid-refresh-token";
        when(authService.refreshToken(anyString())).thenReturn(tokenResponseDto);

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/refresh-token")
                .param("refreshToken", refreshToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value(tokenResponseDto.getAccessToken()))
                .andExpect(jsonPath("$.refreshToken").value(tokenResponseDto.getRefreshToken()));
    }
} 