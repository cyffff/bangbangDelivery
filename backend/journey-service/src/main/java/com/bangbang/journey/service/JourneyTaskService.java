package com.bangbang.journey.service;

import com.bangbang.journey.dto.JourneyTaskDto;

import java.util.List;

/**
 * Service interface for managing tasks associated with journeys
 */
public interface JourneyTaskService {
    
    /**
     * Get all tasks for a specific journey
     * 
     * @param journeyId the journey ID
     * @return list of tasks associated with the journey
     */
    List<JourneyTaskDto> getTasksByJourneyId(Long journeyId);
    
    /**
     * Get a specific task by ID
     * 
     * @param taskId the task ID
     * @return the task details
     */
    JourneyTaskDto getTaskById(String taskId);
    
    /**
     * Associate a task with a journey
     * 
     * @param journeyId the journey ID
     * @param taskId the task ID
     * @return the updated task
     */
    JourneyTaskDto assignTaskToJourney(Long journeyId, String taskId);
    
    /**
     * Remove a task from a journey
     * 
     * @param journeyId the journey ID
     * @param taskId the task ID
     */
    void removeTaskFromJourney(Long journeyId, String taskId);
    
    /**
     * Update the status of a task
     * 
     * @param taskId the task ID
     * @param status the new status
     * @return the updated task
     */
    JourneyTaskDto updateTaskStatus(String taskId, String status);
} 