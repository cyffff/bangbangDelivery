package com.bangbang.review.service.impl;

import com.bangbang.review.dto.ReviewRequest;
import com.bangbang.review.dto.ReviewResponse;
import com.bangbang.review.dto.ReviewSummary;
import com.bangbang.review.exception.ReviewNotFoundException;
import com.bangbang.review.mapper.ReviewMapper;
import com.bangbang.review.model.Review;
import com.bangbang.review.model.ReviewType;
import com.bangbang.review.repository.ReviewRepository;
import com.bangbang.review.service.ReviewService;
import com.bangbang.review.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;
    private final ReviewMapper reviewMapper;

    @Autowired
    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            UserService userService,
            ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.userService = userService;
        this.reviewMapper = reviewMapper;
    }

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest reviewRequest) {
        // Validate reviewer exists
        if (!userService.existsById(reviewRequest.getReviewerId())) {
            throw new IllegalArgumentException("Reviewer does not exist");
        }
        
        // Check if user has already reviewed this target
        if (hasReviewed(reviewRequest.getReviewerId(), reviewRequest.getTargetId(), reviewRequest.getType())) {
            throw new IllegalArgumentException("You have already reviewed this " + 
                    reviewRequest.getType().toString().toLowerCase());
        }
        
        // Convert request to entity
        Review review = reviewMapper.reviewRequestToReview(reviewRequest);
        
        // Set reviewer name
        review.setReviewerName(userService.getUsernameById(reviewRequest.getReviewerId()));
        
        // Save the review
        Review savedReview = reviewRepository.save(review);
        
        // Get target name based on type
        String targetName = getTargetName(savedReview.getTargetId(), savedReview.getType());
        
        // Convert to response and return
        return reviewMapper.reviewToReviewResponse(savedReview, targetName);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + reviewId));
        
        String targetName = getTargetName(review.getTargetId(), review.getType());
        
        return reviewMapper.reviewToReviewResponse(review, targetName);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Long reviewId, ReviewRequest reviewRequest) {
        Review existingReview = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + reviewId));
        
        // Validate that the reviewer is the same
        if (!existingReview.getReviewerId().equals(reviewRequest.getReviewerId())) {
            throw new IllegalArgumentException("You can only update your own reviews");
        }
        
        // Update fields
        existingReview.setRating(reviewRequest.getRating());
        existingReview.setComment(reviewRequest.getComment());
        if (reviewRequest.getIsPublic() != null) {
            existingReview.setIsPublic(reviewRequest.getIsPublic());
        }
        
        // Reset approval status on update
        existingReview.setIsApproved(false);
        
        // Save updated review
        Review updatedReview = reviewRepository.save(existingReview);
        
        String targetName = getTargetName(updatedReview.getTargetId(), updatedReview.getType());
        
        return reviewMapper.reviewToReviewResponse(updatedReview, targetName);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ReviewNotFoundException("Review not found with id: " + reviewId);
        }
        
        reviewRepository.deleteById(reviewId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByReviewer(Long reviewerId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByReviewerId(reviewerId, pageable);
        
        return reviews.map(review -> {
            String targetName = getTargetName(review.getTargetId(), review.getType());
            return reviewMapper.reviewToReviewResponse(review, targetName);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByTarget(Long targetId, ReviewType type, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByTargetIdAndType(targetId, type, pageable);
        
        // Get target name once for all reviews
        String targetName = getTargetName(targetId, type);
        
        return reviews.map(review -> 
            reviewMapper.reviewToReviewResponse(review, targetName)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getPublicReviewsByTarget(Long targetId, ReviewType type, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByTargetIdAndTypeAndIsPublicTrueAndIsApprovedTrue(
                targetId, type, pageable);
        
        String targetName = getTargetName(targetId, type);
        
        return reviews.map(review -> 
            reviewMapper.reviewToReviewResponse(review, targetName)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByOrder(Long orderId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByOrderId(orderId, pageable);
        
        return reviews.map(review -> {
            String targetName = getTargetName(review.getTargetId(), review.getType());
            return reviewMapper.reviewToReviewResponse(review, targetName);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByJourney(Long journeyId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByJourneyId(journeyId, pageable);
        
        return reviews.map(review -> {
            String targetName = getTargetName(review.getTargetId(), review.getType());
            return reviewMapper.reviewToReviewResponse(review, targetName);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByDemand(Long demandId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByDemandId(demandId, pageable);
        
        return reviews.map(review -> {
            String targetName = getTargetName(review.getTargetId(), review.getType());
            return reviewMapper.reviewToReviewResponse(review, targetName);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewSummary getReviewSummary(Long targetId, ReviewType type) {
        Double averageRating = reviewRepository.calculateAverageRating(targetId, type);
        Long totalReviews = reviewRepository.countByTargetIdAndTypeAndIsPublicTrueAndIsApprovedTrue(targetId, type);
        
        // Default to 0.0 if no reviews
        if (averageRating == null) {
            averageRating = 0.0;
        }
        
        // Count reviews by rating
        Long fiveStarCount = reviewRepository.countByTargetIdAndTypeAndRating(targetId, type, 5);
        Long fourStarCount = reviewRepository.countByTargetIdAndTypeAndRating(targetId, type, 4);
        Long threeStarCount = reviewRepository.countByTargetIdAndTypeAndRating(targetId, type, 3);
        Long twoStarCount = reviewRepository.countByTargetIdAndTypeAndRating(targetId, type, 2);
        Long oneStarCount = reviewRepository.countByTargetIdAndTypeAndRating(targetId, type, 1);
        
        return ReviewSummary.builder()
                .targetId(targetId)
                .type(type)
                .averageRating(averageRating)
                .totalReviews(totalReviews)
                .fiveStarCount(fiveStarCount)
                .fourStarCount(fourStarCount)
                .threeStarCount(threeStarCount)
                .twoStarCount(twoStarCount)
                .oneStarCount(oneStarCount)
                .build();
    }

    @Override
    @Transactional
    public ReviewResponse approveReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + reviewId));
        
        review.setIsApproved(true);
        Review approvedReview = reviewRepository.save(review);
        
        String targetName = getTargetName(approvedReview.getTargetId(), approvedReview.getType());
        
        return reviewMapper.reviewToReviewResponse(approvedReview, targetName);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsPendingApproval() {
        List<Review> reviews = reviewRepository.findByIsApprovedFalse();
        
        return reviews.stream()
                .map(review -> {
                    String targetName = getTargetName(review.getTargetId(), review.getType());
                    return reviewMapper.reviewToReviewResponse(review, targetName);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasReviewed(Long reviewerId, Long targetId, ReviewType type) {
        return reviewRepository.existsByReviewerIdAndTargetIdAndType(reviewerId, targetId, type);
    }
    
    /**
     * Get the name of a target based on its type and ID
     * 
     * @param targetId the target ID
     * @param type the review type
     * @return the target name
     */
    private String getTargetName(Long targetId, ReviewType type) {
        if (type == ReviewType.USER) {
            return userService.getUsernameById(targetId);
        }
        
        // For other types, we would integrate with the appropriate service
        // For now, return a generic name based on type
        return type.toString() + " #" + targetId;
    }
} 