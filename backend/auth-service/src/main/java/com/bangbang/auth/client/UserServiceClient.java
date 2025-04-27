package com.bangbang.auth.client;

import com.bangbang.auth.dto.UserProfileDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for calling User Service APIs.
 */
@FeignClient(name = "user-service", url = "${app.services.user-service.url}")
public interface UserServiceClient {

    /**
     * Get a user profile by ID.
     *
     * @param userId the user ID
     * @return the user profile
     */
    @GetMapping("/api/v1/users/{userId}")
    ResponseEntity<UserProfileDto> getUserById(@PathVariable("userId") Long userId);

    /**
     * Get a user by username from the user-service.
     *
     * @param username the username
     * @return the user profile
     */
    @GetMapping("/api/v1/users/by-username/{username}")
    ResponseEntity<UserProfileDto> getUserByUsername(@PathVariable("username") String username);
} 