package com.bangbang.user.service.impl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bangbang.user.security.UserPrincipal;
import com.bangbang.user.service.SecurityService;

import lombok.RequiredArgsConstructor;

/**
 * Implementation of the SecurityService.
 */
@Service
@RequiredArgsConstructor
public class SecurityServiceImpl implements SecurityService {

    @Override
    public boolean isCurrentUser(Long userId) {
        if (userId == null) {
            return false;
        }
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserPrincipal)) {
            return false;
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) principal;
        return userId.equals(userPrincipal.getId());
    }

    @Override
    public boolean isCurrentUsername(String username) {
        if (username == null) {
            return false;
        }
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserPrincipal)) {
            return false;
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) principal;
        return username.equals(userPrincipal.getUsername());
    }
} 