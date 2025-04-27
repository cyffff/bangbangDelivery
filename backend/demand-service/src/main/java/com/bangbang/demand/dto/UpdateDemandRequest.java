package com.bangbang.demand.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Future;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDemandRequest {
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    private String itemType;
    
    @Positive(message = "Weight must be positive")
    @DecimalMin(value = "0.1", message = "Weight must be at least 0.1 kg")
    private Double weightKg;
    
    private BigDecimal estimatedValue;
    
    private String originCountry;
    
    private String originCity;
    
    private String destinationCountry;
    
    private String destinationCity;
    
    @Future(message = "Deadline must be in the future")
    private LocalDate deadline;
    
    @DecimalMin(value = "5.0", message = "Minimum reward is $5")
    private BigDecimal rewardAmount;
    
    private String status;
} 