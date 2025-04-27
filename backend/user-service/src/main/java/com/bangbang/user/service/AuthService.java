package com.bangbang.user.service;

import com.bangbang.user.dto.LoginRequestDto;
import com.bangbang.user.dto.TokenResponseDto;
import com.bangbang.user.dto.UserProfileDto;
import com.bangbang.user.dto.UserRegistrationDto;

/**
 * Service interface for authentication and user management operations.
 */
public interface AuthService {

    /**
     * Registers a new user in the system.
     *
     * @param registrationDto the user registration data
     * @return the profile of the newly registered user
     * @throws com.bangbang.user.exception.UserAlreadyExistsException if a user with the given username or email already exists
     */
    UserProfileDto registerUser(UserRegistrationDto registrationDto);

    /**
     * Authenticates a user and generates access tokens.
     *
     * @param loginRequest the login credentials
     * @return the generated JWT tokens
     * @throws com.bangbang.user.exception.AuthenticationFailedException if authentication fails
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
     * @throws com.bangbang.user.exception.InvalidTokenException if the refresh token is invalid
     */
    TokenResponseDto refreshToken(String refreshToken);

    /**
     * Logs out a user by invalidating their tokens.
     *
     * @param userId the ID of the user to log out
     */
    void logout(Long userId);
} 