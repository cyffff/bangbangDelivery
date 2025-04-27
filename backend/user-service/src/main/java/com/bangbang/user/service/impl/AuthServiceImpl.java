package com.bangbang.user.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bangbang.user.constant.SecurityConstants;
import com.bangbang.user.dto.LoginRequestDto;
import com.bangbang.user.dto.TokenResponseDto;
import com.bangbang.user.dto.UserProfileDto;
import com.bangbang.user.dto.UserRegistrationDto;
import com.bangbang.user.entity.Role;
import com.bangbang.user.entity.User;
import com.bangbang.user.exception.AuthenticationFailedException;
import com.bangbang.user.exception.InvalidTokenException;
import com.bangbang.user.exception.ResourceNotFoundException;
import com.bangbang.user.exception.UserAlreadyExistsException;
import com.bangbang.user.mapper.UserMapper;
import com.bangbang.user.repository.RoleRepository;
import com.bangbang.user.repository.UserRepository;
import com.bangbang.user.security.JwtTokenProvider;
import com.bangbang.user.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
        Role userRole = roleRepository.findByName(SecurityConstants.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", SecurityConstants.ROLE_USER));
        
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
            
            // Generate JWT tokens
            TokenResponseDto tokenResponse = tokenProvider.generateToken(authentication);
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
        log.info("Token refreshed successfully");
        
        return tokenResponse;
    }

    @Override
    public void logout(Long userId) {
        log.info("Logging out user with ID: {}", userId);
        tokenProvider.invalidateTokens(userId);
        log.info("User logged out successfully");
    }
} 