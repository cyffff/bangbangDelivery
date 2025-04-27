package com.bangbang.journey.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for representing tasks associated with journeys
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JourneyTaskDto {
    private String id;
    private String title;
    private String description;
    private String status;
    private String itemType;
    private Double weightKg;
    private String originCountry;
    private String originCity;
    private String destinationCountry;
    private String destinationCity;
    private String userId;
    private Long journeyId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 