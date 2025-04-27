package com.bangbang.journey.repository;

import com.bangbang.journey.model.JourneyTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for JourneyTask entity
 */
@Repository
public interface JourneyTaskRepository extends JpaRepository<JourneyTask, Long> {
    
    /**
     * Find all tasks associated with a journey
     * 
     * @param journeyId the journey ID
     * @return list of journey-task relationships
     */
    List<JourneyTask> findByJourneyId(Long journeyId);
    
    /**
     * Find a specific journey-task relationship by journey ID and task ID
     * 
     * @param journeyId the journey ID
     * @param taskId the task ID
     * @return optional containing the journey-task relationship if found
     */
    Optional<JourneyTask> findByJourneyIdAndTaskId(Long journeyId, String taskId);
    
    /**
     * Find all journey-task relationships by task ID
     * 
     * @param taskId the task ID
     * @return list of journey-task relationships
     */
    List<JourneyTask> findByTaskId(String taskId);
} 