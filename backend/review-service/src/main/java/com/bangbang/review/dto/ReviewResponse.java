package com.bangbang.review.dto;

import com.bangbang.review.model.ReviewType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private Long targetId;
    private String targetName;
    private ReviewType type;
    private Integer rating;
    private String comment;
    private Boolean isPublic;
    private Boolean isApproved;
    private Long orderId;
    private Long journeyId;
    private Long demandId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 