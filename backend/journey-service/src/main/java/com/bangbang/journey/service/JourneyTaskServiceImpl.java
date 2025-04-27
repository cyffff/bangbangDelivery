package com.bangbang.journey.service;

import com.bangbang.journey.client.DemandServiceClient;
import com.bangbang.journey.dto.JourneyTaskDto;
import com.bangbang.journey.exception.ResourceNotFoundException;
import com.bangbang.journey.model.Journey;
import com.bangbang.journey.model.JourneyStatus;
import com.bangbang.journey.model.JourneyTask;
import com.bangbang.journey.repository.JourneyRepository;
import com.bangbang.journey.repository.JourneyTaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the JourneyTaskService
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class JourneyTaskServiceImpl implements JourneyTaskService {
    
    private final JourneyTaskRepository journeyTaskRepository;
    private final JourneyRepository journeyRepository;
    private final DemandServiceClient demandServiceClient;
    
    @Override
    @Transactional(readOnly = true)
    public List<JourneyTaskDto> getTasksByJourneyId(Long journeyId) {
        log.info("Fetching tasks for journey ID: {}", journeyId);
        
        // Verify journey exists
        verifyJourneyExists(journeyId);
        
        // Get all journey-task relationships
        List<JourneyTask> journeyTasks = journeyTaskRepository.findByJourneyId(journeyId);
        
        // Fetch task details from demand service
        List<JourneyTaskDto> tasks = new ArrayList<>();
        for (JourneyTask journeyTask : journeyTasks) {
            try {
                JourneyTaskDto task = demandServiceClient.getTaskById(journeyTask.getTaskId());
                task.setJourneyId(journeyId);
                tasks.add(task);
            } catch (Exception e) {
                log.error("Error fetching task details for taskId: {}", journeyTask.getTaskId(), e);
                // Instead of failing the entire request, continue with other tasks
            }
        }
        
        return tasks;
    }
    
    @Override
    @Transactional(readOnly = true)
    public JourneyTaskDto getTaskById(String taskId) {
        log.info("Fetching task details for ID: {}", taskId);
        
        // Get the task details from demand service
        JourneyTaskDto task = demandServiceClient.getTaskById(taskId);
        
        // Check if this task is associated with any journey
        List<JourneyTask> journeyTasks = journeyTaskRepository.findByTaskId(taskId);
        if (!journeyTasks.isEmpty()) {
            task.setJourneyId(journeyTasks.get(0).getJourneyId());
        }
        
        return task;
    }
    
    @Override
    @Transactional
    public JourneyTaskDto assignTaskToJourney(Long journeyId, String taskId) {
        log.info("Assigning task ID: {} to journey ID: {}", taskId, journeyId);
        
        // Verify journey exists and is active
        Journey journey = verifyJourneyActiveOrInProgress(journeyId);
        
        // Check if task is already assigned to this journey
        if (journeyTaskRepository.findByJourneyIdAndTaskId(journeyId, taskId).isPresent()) {
            log.warn("Task already assigned to journey. JourneyId: {}, TaskId: {}", journeyId, taskId);
            return getTaskById(taskId);
        }
        
        // Get task details to verify it exists
        JourneyTaskDto task = demandServiceClient.getTaskById(taskId);
        
        // Create new journey-task relationship
        JourneyTask journeyTask = JourneyTask.builder()
                .journeyId(journeyId)
                .taskId(taskId)
                .taskStatus(task.getStatus())
                .build();
        
        journeyTaskRepository.save(journeyTask);
        log.info("Task assigned to journey successfully. JourneyId: {}, TaskId: {}", journeyId, taskId);
        
        // Update task with journey ID
        task.setJourneyId(journeyId);
        return task;
    }
    
    @Override
    @Transactional
    public void removeTaskFromJourney(Long journeyId, String taskId) {
        log.info("Removing task ID: {} from journey ID: {}", taskId, journeyId);
        
        // Verify journey exists
        verifyJourneyExists(journeyId);
        
        // Find the journey-task relationship
        JourneyTask journeyTask = journeyTaskRepository.findByJourneyIdAndTaskId(journeyId, taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not assigned to this journey"));
        
        // Delete the relationship
        journeyTaskRepository.delete(journeyTask);
        log.info("Task removed from journey successfully. JourneyId: {}, TaskId: {}", journeyId, taskId);
    }
    
    @Override
    @Transactional
    public JourneyTaskDto updateTaskStatus(String taskId, String status) {
        log.info("Updating task ID: {} to status: {}", taskId, status);
        
        // Update status in demand service
        JourneyTaskDto updatedTask = demandServiceClient.updateTaskStatus(taskId, status);
        
        // Update status in journey-task relationships
        List<JourneyTask> journeyTasks = journeyTaskRepository.findByTaskId(taskId);
        for (JourneyTask journeyTask : journeyTasks) {
            journeyTask.setTaskStatus(status);
            journeyTaskRepository.save(journeyTask);
            
            // Set journey ID in the returned task if found
            updatedTask.setJourneyId(journeyTask.getJourneyId());
        }
        
        return updatedTask;
    }
    
    private Journey verifyJourneyExists(Long journeyId) {
        return journeyRepository.findById(journeyId)
                .orElseThrow(() -> new ResourceNotFoundException("Journey not found with ID: " + journeyId));
    }
    
    private Journey verifyJourneyActiveOrInProgress(Long journeyId) {
        Journey journey = verifyJourneyExists(journeyId);
        
        if (journey.getStatus() != JourneyStatus.ACTIVE && journey.getStatus() != JourneyStatus.IN_PROGRESS) {
            throw new IllegalStateException("Tasks can only be assigned to active or in-progress journeys");
        }
        
        return journey;
    }
} 