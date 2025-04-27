package com.bangbang.auth.service;

import com.bangbang.auth.dto.LoginRequestDto;
import com.bangbang.auth.dto.TokenResponseDto;
import com.bangbang.auth.dto.UserProfileDto;
import com.bangbang.auth.dto.UserRegistrationDto;

/**
 * Service interface for authentication operations.
 */
public interface AuthService {

    /**
     * Registers a new user in the system.
     *
     * @param registrationDto the user registration data
     * @return the profile of the newly registered user
     * @throws com.bangbang.auth.exception.UserAlreadyExistsException if a user with the given username or email already exists
     */
    UserProfileDto registerUser(UserRegistrationDto registrationDto);

    /**
     * Authenticates a user and generates access tokens.
     *
     * @param loginRequest the login credentials
     * @return the generated JWT tokens
     * @throws com.bangbang.auth.exception.AuthenticationFailedException if authentication fails
     */
    TokenResponseDto login(LoginRequestDto loginRequest);

    /**
     * Validates a JWT token.
     *
     * @param token the token to validate
     * @return true if the token is valid, false otherwise
     */
    boolean validateToken(String token);

    /**
     * Refreshes an access token using a refresh token.
     *
     * @param refreshToken the refresh token
     * @return the new JWT tokens
     * @throws com.bangbang.auth.exception.InvalidTokenException if the refresh token is invalid
     */
    TokenResponseDto refreshToken(String refreshToken);

    /**
     * Logs out the current user by invalidating their tokens.
     */
    void logout();
} 