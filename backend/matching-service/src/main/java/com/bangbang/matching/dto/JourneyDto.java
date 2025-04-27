package com.bangbang.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JourneyDto {
    private Long id;
    private Long userId;
    private String fromCountry;
    private String fromCity;
    private String toCountry;
    private String toCity;
    private LocalDate departureDate;
    private LocalDate arrivalDate;
    private Double availableWeight;
    private Double availableVolume;
    private String notes;
    private Set<String> preferredItemTypes;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 