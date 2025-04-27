package com.bangbang.review.repository;

import com.bangbang.review.model.Review;
import com.bangbang.review.model.ReviewType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Find reviews by reviewer ID
    Page<Review> findByReviewerId(Long reviewerId, Pageable pageable);
    
    // Find reviews by target ID and type
    Page<Review> findByTargetIdAndType(Long targetId, ReviewType type, Pageable pageable);
    
    // Find public and approved reviews by target ID and type
    Page<Review> findByTargetIdAndTypeAndIsPublicTrueAndIsApprovedTrue(Long targetId, ReviewType type, Pageable pageable);
    
    // Find reviews by order ID
    Page<Review> findByOrderId(Long orderId, Pageable pageable);
    
    // Find reviews by journey ID
    Page<Review> findByJourneyId(Long journeyId, Pageable pageable);
    
    // Find reviews by demand ID
    Page<Review> findByDemandId(Long demandId, Pageable pageable);
    
    // Count reviews by target ID and type
    long countByTargetIdAndType(Long targetId, ReviewType type);
    
    // Count public and approved reviews by target ID and type
    long countByTargetIdAndTypeAndIsPublicTrueAndIsApprovedTrue(Long targetId, ReviewType type);
    
    // Calculate average rating for a target
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.targetId = ?1 AND r.type = ?2 AND r.isPublic = true AND r.isApproved = true")
    Double calculateAverageRating(Long targetId, ReviewType type);
    
    // Count reviews by rating value for a target
    @Query("SELECT COUNT(r) FROM Review r WHERE r.targetId = ?1 AND r.type = ?2 AND r.rating = ?3 AND r.isPublic = true AND r.isApproved = true")
    Long countByTargetIdAndTypeAndRating(Long targetId, ReviewType type, Integer rating);
    
    // Check if reviewer has already reviewed this target
    boolean existsByReviewerIdAndTargetIdAndType(Long reviewerId, Long targetId, ReviewType type);
    
    // Find reviews that need approval
    List<Review> findByIsApprovedFalse();
} 