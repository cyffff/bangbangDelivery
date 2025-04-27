package com.bangbang.demand.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDemandRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @NotBlank(message = "Item type is required")
    private String itemType;
    
    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    @DecimalMin(value = "0.1", message = "Weight must be at least 0.1 kg")
    private Double weightKg;
    
    private BigDecimal estimatedValue;
    
    @NotBlank(message = "Origin country is required")
    private String originCountry;
    
    @NotBlank(message = "Origin city is required")
    private String originCity;
    
    @NotBlank(message = "Destination country is required")
    private String destinationCountry;
    
    @NotBlank(message = "Destination city is required")
    private String destinationCity;
    
    @NotNull(message = "Deadline is required")
    @Future(message = "Deadline must be in the future")
    private LocalDate deadline;
    
    @NotNull(message = "Reward amount is required")
    @DecimalMin(value = "5.0", message = "Minimum reward is $5")
    private BigDecimal rewardAmount;
} 