package com.bangbang.demand.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemandDto {
    private String id;
    private String userId;
    private String title;
    private String description;
    private String itemType;
    private Double weightKg;
    private BigDecimal estimatedValue;
    private String originCountry;
    private String originCity;
    private String destinationCountry;
    private String destinationCity;
    private LocalDate deadline;
    private BigDecimal rewardAmount;
    private String status;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 