package com.bangbang.auth.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bangbang.auth.dto.LoginRequestDto;
import com.bangbang.auth.dto.TokenResponseDto;
import com.bangbang.auth.dto.UserProfileDto;
import com.bangbang.auth.dto.UserRegistrationDto;
import com.bangbang.auth.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for authentication operations.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new user.
     *
     * @param registrationDto the user registration data
     * @return the profile of the newly registered user
     */
    @PostMapping("/register")
    public ResponseEntity<UserProfileDto> register(@Valid @RequestBody UserRegistrationDto registrationDto) {
        log.info("Received registration request for username: {}", registrationDto.getUsername());
        UserProfileDto userProfile = authService.registerUser(registrationDto);
        return ResponseEntity.ok(userProfile);
    }

    /**
     * Authenticate a user and generate JWT tokens.
     *
     * @param loginRequest the login credentials
     * @return the generated JWT tokens
     */
    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        log.info("Received login request for username: {}", loginRequest.getUsername());
        TokenResponseDto tokenResponse = authService.login(loginRequest);
        return ResponseEntity.ok(tokenResponse);
    }

    /**
     * Refresh an access token using a refresh token.
     *
     * @param refreshToken the refresh token
     * @return the new JWT tokens
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<TokenResponseDto> refreshToken(@RequestParam String refreshToken) {
        log.info("Received refresh token request");
        TokenResponseDto tokenResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(tokenResponse);
    }

    /**
     * Log out a user by invalidating their tokens.
     *
     * @return a success response
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        log.info("Received logout request");
        authService.logout();
        return ResponseEntity.ok().build();
    }
} 