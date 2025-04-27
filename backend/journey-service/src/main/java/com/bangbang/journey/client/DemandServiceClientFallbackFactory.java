package com.bangbang.journey.client;

import com.bangbang.journey.dto.JourneyTaskDto;
import com.bangbang.journey.exception.ServiceCommunicationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

/**
 * Fallback factory for DemandServiceClient
 */
@Component
@Slf4j
public class DemandServiceClientFallbackFactory implements FallbackFactory<DemandServiceClient> {
    
    @Override
    public DemandServiceClient create(Throwable cause) {
        return new DemandServiceClient() {
            @Override
            public JourneyTaskDto getTaskById(String taskId) {
                log.error("Failed to get task from demand service. Task ID: {}", taskId, cause);
                throw new ServiceCommunicationException("Unable to fetch task details from demand service", cause);
            }
            
            @Override
            public JourneyTaskDto updateTaskStatus(String taskId, String status) {
                log.error("Failed to update task status in demand service. Task ID: {}, Status: {}", taskId, status, cause);
                throw new ServiceCommunicationException("Unable to update task status in demand service", cause);
            }
        };
    }
} 