package com.bangbang.review.service.impl;

import com.bangbang.review.client.UserClient;
import com.bangbang.review.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserClient userClient;

    @Autowired
    public UserServiceImpl(UserClient userClient) {
        this.userClient = userClient;
    }

    @Override
    public String getUsernameById(Long userId) {
        try {
            ResponseEntity<String> response = userClient.getUsernameById(userId);
            return response.getBody();
        } catch (Exception e) {
            // If user service is unavailable or user not found, return a placeholder
            return "Unknown User";
        }
    }

    @Override
    public boolean existsById(Long userId) {
        try {
            ResponseEntity<Boolean> response = userClient.checkUserExists(userId);
            return Boolean.TRUE.equals(response.getBody());
        } catch (Exception e) {
            // If user service is unavailable, assume user doesn't exist
            return false;
        }
    }
} 