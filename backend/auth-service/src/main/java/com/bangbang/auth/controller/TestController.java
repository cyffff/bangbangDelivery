package com.bangbang.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "Test endpoint working!";
    }

    @GetMapping("/api/v1/auth/test")
    public String testWithPath() {
        return "Test endpoint with full path working!";
    }
} 