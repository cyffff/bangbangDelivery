package com.bangbang.auth.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;

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
     * Health check endpoint.
     *
     * @return a success response with a health status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is healthy");
    }

    /**
     * Special registration endpoint for frontend browser requests.
     * This is explicitly permitted in security config without authentication.
     *
     * @param registrationDto the user registration data
     * @return the profile of the newly registered user
     */
    @PostMapping("/browser-register")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> browserRegister(@Valid @RequestBody UserRegistrationDto registrationDto) {
        try {
            log.info("Received browser registration request for username: {}", registrationDto.getUsername());
            UserProfileDto userProfile = authService.registerUser(registrationDto);
            log.info("Successfully registered user from browser: {}", registrationDto.getUsername());
            return ResponseEntity.ok(userProfile);
        } catch (Exception e) {
            log.error("Error registering user from browser: {}", e.getMessage(), e);
            
            // Check for common error types and return appropriate status codes
            String errorMsg = e.getMessage().toLowerCase();
            if (errorMsg.contains("username already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists. Please choose a different username.");
            } else if (errorMsg.contains("email already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already in use. Please use a different email address.");
            } else if (errorMsg.contains("validation")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Validation error: " + e.getMessage());
            }
            
            // Default error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error registering user: " + e.getMessage());
        }
    }

    /**
     * Register a new user.
     *
     * @param registrationDto the user registration data
     * @return the profile of the newly registered user
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationDto registrationDto) {
        try {
            log.info("Received registration request for username: {}", registrationDto.getUsername());
            UserProfileDto userProfile = authService.registerUser(registrationDto);
            log.info("Successfully registered user: {}", registrationDto.getUsername());
            return ResponseEntity.ok(userProfile);
        } catch (Exception e) {
            log.error("Error registering user: {}", e.getMessage(), e);
            
            // Check for common error types and return appropriate status codes
            String errorMsg = e.getMessage().toLowerCase();
            if (errorMsg.contains("username already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists. Please choose a different username.");
            } else if (errorMsg.contains("email already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already in use. Please use a different email address.");
            } else if (errorMsg.contains("validation")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Validation error: " + e.getMessage());
            }
            
            // Default error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error registering user: " + e.getMessage());
        }
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