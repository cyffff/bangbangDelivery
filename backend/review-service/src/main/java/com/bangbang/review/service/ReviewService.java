package com.bangbang.review.service;

import com.bangbang.review.dto.ReviewRequest;
import com.bangbang.review.dto.ReviewResponse;
import com.bangbang.review.dto.ReviewSummary;
import com.bangbang.review.model.ReviewType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service for handling review operations
 */
public interface ReviewService {
    
    /**
     * Create a new review
     * 
     * @param reviewRequest the review request
     * @return the created review
     */
    ReviewResponse createReview(ReviewRequest reviewRequest);
    
    /**
     * Get a review by ID
     * 
     * @param reviewId the review ID
     * @return the review
     */
    ReviewResponse getReview(Long reviewId);
    
    /**
     * Update an existing review
     * 
     * @param reviewId the review ID
     * @param reviewRequest the updated review request
     * @return the updated review
     */
    ReviewResponse updateReview(Long reviewId, ReviewRequest reviewRequest);
    
    /**
     * Delete a review
     * 
     * @param reviewId the review ID
     */
    void deleteReview(Long reviewId);
    
    /**
     * Get reviews submitted by a user
     * 
     * @param reviewerId the reviewer ID
     * @param pageable pagination info
     * @return page of reviews
     */
    Page<ReviewResponse> getReviewsByReviewer(Long reviewerId, Pageable pageable);
    
    /**
     * Get all reviews for a target
     * 
     * @param targetId the target ID
     * @param type the review type
     * @param pageable pagination info
     * @return page of reviews
     */
    Page<ReviewResponse> getReviewsByTarget(Long targetId, ReviewType type, Pageable pageable);
    
    /**
     * Get public and approved reviews for a target
     * 
     * @param targetId the target ID
     * @param type the review type
     * @param pageable pagination info
     * @return page of reviews
     */
    Page<ReviewResponse> getPublicReviewsByTarget(Long targetId, ReviewType type, Pageable pageable);
    
    /**
     * Get reviews for an order
     * 
     * @param orderId the order ID
     * @param pageable pagination info
     * @return page of reviews
     */
    Page<ReviewResponse> getReviewsByOrder(Long orderId, Pageable pageable);
    
    /**
     * Get reviews for a journey
     * 
     * @param journeyId the journey ID
     * @param pageable pagination info
     * @return page of reviews
     */
    Page<ReviewResponse> getReviewsByJourney(Long journeyId, Pageable pageable);
    
    /**
     * Get reviews for a demand
     * 
     * @param demandId the demand ID
     * @param pageable pagination info
     * @return page of reviews
     */
    Page<ReviewResponse> getReviewsByDemand(Long demandId, Pageable pageable);
    
    /**
     * Get a summary of reviews for a target
     * 
     * @param targetId the target ID
     * @param type the review type
     * @return review summary
     */
    ReviewSummary getReviewSummary(Long targetId, ReviewType type);
    
    /**
     * Approve a review
     * 
     * @param reviewId the review ID
     * @return the approved review
     */
    ReviewResponse approveReview(Long reviewId);
    
    /**
     * Get reviews pending approval
     * 
     * @return list of reviews pending approval
     */
    List<ReviewResponse> getReviewsPendingApproval();
    
    /**
     * Check if a user has already reviewed a target
     * 
     * @param reviewerId the reviewer ID
     * @param targetId the target ID
     * @param type the review type
     * @return true if the user has already reviewed this target
     */
    boolean hasReviewed(Long reviewerId, Long targetId, ReviewType type);
} 