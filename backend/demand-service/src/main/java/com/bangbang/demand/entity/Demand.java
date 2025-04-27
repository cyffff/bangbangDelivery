package com.bangbang.demand.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "demands")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Demand {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(nullable = false, length = 100)
    private String title;
    
    @Column(length = 500)
    private String description;
    
    @Column(name = "item_type", nullable = false, length = 50)
    private String itemType;
    
    @Column(name = "weight_kg", nullable = false)
    private Double weightKg;
    
    @Column(name = "estimated_value")
    private BigDecimal estimatedValue;
    
    @Column(name = "origin_country", nullable = false, length = 50)
    private String originCountry;
    
    @Column(name = "origin_city", nullable = false, length = 50)
    private String originCity;
    
    @Column(name = "destination_country", nullable = false, length = 50)
    private String destinationCountry;
    
    @Column(name = "destination_city", nullable = false, length = 50)
    private String destinationCity;
    
    @Column(nullable = false)
    private LocalDate deadline;
    
    @Column(name = "reward_amount")
    private BigDecimal rewardAmount;
    
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";
    
    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 