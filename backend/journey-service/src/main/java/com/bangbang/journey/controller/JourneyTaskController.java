package com.bangbang.journey.controller;

import com.bangbang.journey.dto.JourneyTaskDto;
import com.bangbang.journey.service.JourneyTaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for managing journey tasks
 */
@RestController
@RequestMapping("/api/v1/journeys")
@RequiredArgsConstructor
@Slf4j
public class JourneyTaskController {
    
    private final JourneyTaskService journeyTaskService;
    
    /**
     * Get all tasks for a journey
     */
    @GetMapping("/{journeyId}/tasks")
    public ResponseEntity<List<JourneyTaskDto>> getTasksByJourneyId(@PathVariable Long journeyId) {
        return ResponseEntity.ok(journeyTaskService.getTasksByJourneyId(journeyId));
    }
    
    /**
     * Get a specific task
     */
    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<JourneyTaskDto> getTaskById(@PathVariable String taskId) {
        return ResponseEntity.ok(journeyTaskService.getTaskById(taskId));
    }
    
    /**
     * Assign a task to a journey
     */
    @PostMapping("/{journeyId}/tasks/{taskId}")
    public ResponseEntity<JourneyTaskDto> assignTaskToJourney(
            @PathVariable Long journeyId,
            @PathVariable String taskId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Security check would be done in the service
        JourneyTaskDto task = journeyTaskService.assignTaskToJourney(journeyId, taskId);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }
    
    /**
     * Remove a task from a journey
     */
    @DeleteMapping("/{journeyId}/tasks/{taskId}")
    public ResponseEntity<Void> removeTaskFromJourney(
            @PathVariable Long journeyId,
            @PathVariable String taskId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Security check would be done in the service
        journeyTaskService.removeTaskFromJourney(journeyId, taskId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Update task status
     */
    @PutMapping("/tasks/{taskId}/status")
    public ResponseEntity<JourneyTaskDto> updateTaskStatus(
            @PathVariable String taskId,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Security check would be done in the service
        String status = payload.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        
        JourneyTaskDto updatedTask = journeyTaskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok(updatedTask);
    }
} 