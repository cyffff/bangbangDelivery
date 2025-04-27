package com.bangbang.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.bangbang.auth.dto.UserProfileDto;

/**
 * Feign client for communicating with the user-service.
 */
@FeignClient(name = "user-service")
public interface UserServiceClient {

    /**
     * Get a user by ID from the user-service.
     *
     * @param id the user ID
     * @return the user profile
     */
    @GetMapping("/api/v1/users/{id}")
    ResponseEntity<UserProfileDto> getUserById(@PathVariable("id") Long id);

    /**
     * Get a user by username from the user-service.
     *
     * @param username the username
     * @return the user profile
     */
    @GetMapping("/api/v1/users/by-username/{username}")
    ResponseEntity<UserProfileDto> getUserByUsername(@PathVariable("username") String username);
} 