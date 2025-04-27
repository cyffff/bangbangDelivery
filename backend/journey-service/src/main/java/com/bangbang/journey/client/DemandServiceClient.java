package com.bangbang.journey.client;

import com.bangbang.journey.dto.JourneyTaskDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Feign client for Demand Service
 */
@FeignClient(name = "demand-service", fallbackFactory = DemandServiceClientFallbackFactory.class)
public interface DemandServiceClient {
    
    /**
     * Get task by ID
     * 
     * @param taskId the task ID
     * @return the task details
     */
    @GetMapping("/api/v1/demands/{id}")
    JourneyTaskDto getTaskById(@PathVariable("id") String taskId);
    
    /**
     * Update task status
     * 
     * @param taskId the task ID
     * @param status the new status
     * @return the updated task
     */
    @PutMapping("/api/v1/demands/{id}/status")
    JourneyTaskDto updateTaskStatus(@PathVariable("id") String taskId, @RequestBody String status);
} 