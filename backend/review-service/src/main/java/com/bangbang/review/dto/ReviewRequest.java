package com.bangbang.review.dto;

import com.bangbang.review.model.ReviewType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    
    @NotNull(message = "Reviewer ID is required")
    private Long reviewerId;
    
    @NotNull(message = "Target ID is required")
    private Long targetId;
    
    @NotNull(message = "Review type is required")
    private ReviewType type;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
    
    private String comment;
    
    private Boolean isPublic;
    
    private Long orderId;
    
    private Long journeyId;
    
    private Long demandId;
} 