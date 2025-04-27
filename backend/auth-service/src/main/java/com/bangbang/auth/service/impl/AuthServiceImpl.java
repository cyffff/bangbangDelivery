package com.bangbang.auth.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bangbang.auth.client.UserServiceClient;
import com.bangbang.auth.dto.LoginRequestDto;
import com.bangbang.auth.dto.TokenResponseDto;
import com.bangbang.auth.dto.UserProfileDto;
import com.bangbang.auth.dto.UserRegistrationDto;
import com.bangbang.auth.entity.Role;
import com.bangbang.auth.entity.User;
import com.bangbang.auth.exception.AuthenticationFailedException;
import com.bangbang.auth.exception.InvalidTokenException;
import com.bangbang.auth.exception.ResourceNotFoundException;
import com.bangbang.auth.exception.UserAlreadyExistsException;
import com.bangbang.auth.mapper.UserMapper;
import com.bangbang.auth.repository.RoleRepository;
import com.bangbang.auth.repository.UserRepository;
import com.bangbang.auth.security.JwtTokenProvider;
import com.bangbang.auth.security.UserPrincipal;
import com.bangbang.auth.service.AuthService;
import com.bangbang.auth.util.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of the AuthService interface.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserServiceClient userServiceClient;
    
    private static final String ROLE_USER = "ROLE_USER";

    @Override
    @Transactional
    public UserProfileDto registerUser(UserRegistrationDto registrationDto) {
        log.info("Registering new user with username: {}", registrationDto.getUsername());
        
        // Check if username already exists
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            log.warn("Registration failed: Username {} already exists", registrationDto.getUsername());
            throw new UserAlreadyExistsException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            log.warn("Registration failed: Email {} already exists", registrationDto.getEmail());
            throw new UserAlreadyExistsException("Email already exists");
        }

        // Create new user entity from DTO
        User user = userMapper.userRegistrationDtoToUser(registrationDto);
        
        // Encode password
        user.setPasswordHash(passwordEncoder.encode(registrationDto.getPassword()));
        
        // Assign default user role
        Role userRole = roleRepository.findByName(ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", ROLE_USER));
        
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        
        // Save user
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        
        return userMapper.userToUserProfileDto(savedUser);
    }

    @Override
    public TokenResponseDto login(LoginRequestDto loginRequest) {
        log.info("Attempting login for user: {}", loginRequest.getUsername());
        
        try {
            // Authenticate with username and password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            // Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Get the user principal
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            // Generate JWT tokens
            TokenResponseDto tokenResponse = tokenProvider.generateToken(authentication);
            
            // Get user profile
            UserProfileDto userProfile = userMapper.userToUserProfileDto(
                userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()))
            );
            
            // Set user in response
            tokenResponse.setUser(userProfile);
            
            log.info("User {} logged in successfully", loginRequest.getUsername());
            
            return tokenResponse;
        } catch (Exception e) {
            log.error("Login failed for user: {}", loginRequest.getUsername(), e);
            throw new AuthenticationFailedException("Invalid username or password");
        }
    }

    @Override
    public boolean validateToken(String token) {
        return tokenProvider.validateToken(token);
    }

    @Override
    public TokenResponseDto refreshToken(String refreshToken) {
        log.info("Attempting to refresh token");
        
        if (!tokenProvider.validateRefreshToken(refreshToken)) {
            log.warn("Invalid refresh token");
            throw new InvalidTokenException("Invalid refresh token");
        }
        
        TokenResponseDto tokenResponse = tokenProvider.generateTokenFromRefreshToken(refreshToken);
        
        // Get user ID from the refresh token
        Long userId = tokenProvider.getUserIdFromJWT(refreshToken);
        
        // Get user profile
        UserProfileDto userProfile = userMapper.userToUserProfileDto(
            userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId))
        );
        
        // Set user in response
        tokenResponse.setUser(userProfile);
        
        log.info("Token refreshed successfully for user ID: {}", userId);
        
        return tokenResponse;
    }

    @Override
    public void logout() {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            tokenProvider.invalidateTokens(userPrincipal.getId());
            log.info("User with ID {} logged out successfully", userPrincipal.getId());
        } else {
            log.warn("Logout attempted but no authenticated user found");
        }
        
        // Clear security context
        SecurityContextHolder.clearContext();
    }
} 