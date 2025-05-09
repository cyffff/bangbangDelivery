package com.bangbang.demand;

import org.springframework.web.bind.annotation.*;
import java.util.*;

/**
 * Test Controller for handling test endpoints
 */
@RestController
public class TestController {

    @GetMapping("/api/v1/test")
    public Map<String, Object> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Test endpoint is working");
        response.put("timestamp", new Date().toString());
        return response;
    }
    
    @GetMapping("/api/v1/test/user123")
    public Map<String, Object> testUser123() {
        Map<String, Object> demand = new HashMap<>();
        demand.put("id", "1");
        demand.put("userId", "user123");
        demand.put("title", "Test Demand");
        demand.put("description", "This is a test demand");
        demand.put("status", "OPEN");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Test user123 endpoint is working");
        response.put("demand", demand);
        response.put("timestamp", new Date().toString());
        return response;
    }
} 