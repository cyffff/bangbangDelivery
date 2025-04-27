package com.bangbang.order.dto;

import com.bangbang.order.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long demandId;
    private Long journeyId;
    private Long demanderId;
    private Long travelerId;
    private String itemName;
    private String description;
    private String pickupLocation;
    private String deliveryLocation;
    private LocalDateTime expectedPickupDate;
    private LocalDateTime expectedDeliveryDate;
    private LocalDateTime actualPickupDate;
    private LocalDateTime actualDeliveryDate;
    private BigDecimal weight;
    private BigDecimal volume;
    private BigDecimal price;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 