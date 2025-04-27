package com.bangbang.order.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long demandId;
    private Long journeyId;
    private Long demanderId;
    private Long travelerId;
    
    private String itemName;
    private String description;
    private Double weight;
    private Double volume;
    
    private String pickupLocation;
    private String deliveryLocation;
    
    private LocalDateTime expectedPickupDate;
    private LocalDateTime expectedDeliveryDate;
    
    private LocalDateTime actualPickupDate;
    private LocalDateTime actualDeliveryDate;
    
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    private String trackingNumber;
    private String notes;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = OrderStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 