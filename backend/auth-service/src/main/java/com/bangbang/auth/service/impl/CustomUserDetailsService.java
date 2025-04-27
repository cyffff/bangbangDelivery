package com.bangbang.auth.service.impl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bangbang.auth.entity.User;
import com.bangbang.auth.exception.ResourceNotFoundException;
import com.bangbang.auth.repository.UserRepository;
import com.bangbang.auth.security.UserPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Custom UserDetailsService implementation for Spring Security.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Allow login with either username or email
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> 
                    new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail)
                );
        
        log.info("User found with username or email: {}", usernameOrEmail);
        return UserPrincipal.create(user);
    }
    
    /**
     * Load a user by ID.
     *
     * @param id the user ID
     * @return the UserDetails
     */
    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("User", "id", id)
                );
        
        return UserPrincipal.create(user);
    }
} 