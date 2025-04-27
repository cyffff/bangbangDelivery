package com.bangbang.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchDto {
    private Long id;
    private String demandId;
    private Long journeyId;
    private String demandUserId;
    private Long journeyUserId;
    private String status;
    private Double matchScore;
    private Boolean demanderConfirmed;
    private Boolean travelerConfirmed;
    private LocalDateTime matchedAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime rejectedAt;
    private LocalDateTime updatedAt;
    
    // Expanded details for UI presentation
    private DemandDto demand;
    private JourneyDto journey;
} 