package com.bangbang.review.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface UserClient {
    
    @GetMapping("/api/users/{userId}/username")
    ResponseEntity<String> getUsernameById(@PathVariable("userId") Long userId);
    
    @GetMapping("/api/users/{userId}/exists")
    ResponseEntity<Boolean> checkUserExists(@PathVariable("userId") Long userId);
} 