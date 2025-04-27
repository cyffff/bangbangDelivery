package com.bangbang.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    
    @NotNull(message = "Demand ID is required")
    private Long demandId;
    
    @NotNull(message = "Journey ID is required")
    private Long journeyId;
    
    @NotNull(message = "Demander ID is required")
    private Long demanderId;
    
    @NotNull(message = "Traveler ID is required")
    private Long travelerId;
    
    @NotBlank(message = "Item name is required")
    private String itemName;
    
    private String description;
    
    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;
    
    @NotBlank(message = "Delivery location is required")
    private String deliveryLocation;
    
    @FutureOrPresent(message = "Expected pickup date must be in the present or future")
    private LocalDateTime expectedPickupDate;
    
    @FutureOrPresent(message = "Expected delivery date must be in the present or future")
    private LocalDateTime expectedDeliveryDate;
    
    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.01", message = "Weight must be greater than 0")
    private BigDecimal weight;
    
    @NotNull(message = "Volume is required")
    @DecimalMin(value = "0.01", message = "Volume must be greater than 0")
    private BigDecimal volume;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;
} 