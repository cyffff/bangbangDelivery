package com.bangbang.review.controller;

import com.bangbang.review.dto.ReviewRequest;
import com.bangbang.review.dto.ReviewResponse;
import com.bangbang.review.dto.ReviewSummary;
import com.bangbang.review.model.ReviewType;
import com.bangbang.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Slf4j
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest reviewRequest) {
        log.info("Creating review from user {} for {} {}", 
                reviewRequest.getReviewerId(), reviewRequest.getType(), reviewRequest.getTargetId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(reviewRequest));
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> getReview(@PathVariable Long reviewId) {
        log.info("Fetching review with id: {}", reviewId);
        return ResponseEntity.ok(reviewService.getReview(reviewId));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest reviewRequest) {
        log.info("Updating review with id: {}", reviewId);
        return ResponseEntity.ok(reviewService.updateReview(reviewId, reviewRequest));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        log.info("Deleting review with id: {}", reviewId);
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reviewer/{reviewerId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByReviewer(
            @PathVariable Long reviewerId,
            Pageable pageable) {
        log.info("Fetching reviews by reviewer: {}", reviewerId);
        return ResponseEntity.ok(reviewService.getReviewsByReviewer(reviewerId, pageable));
    }

    @GetMapping("/target/{targetId}/type/{type}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByTarget(
            @PathVariable Long targetId,
            @PathVariable ReviewType type,
            Pageable pageable) {
        log.info("Fetching reviews for {} with id: {}", type, targetId);
        return ResponseEntity.ok(reviewService.getReviewsByTarget(targetId, type, pageable));
    }

    @GetMapping("/public/target/{targetId}/type/{type}")
    public ResponseEntity<Page<ReviewResponse>> getPublicReviewsByTarget(
            @PathVariable Long targetId,
            @PathVariable ReviewType type,
            Pageable pageable) {
        log.info("Fetching public reviews for {} with id: {}", type, targetId);
        return ResponseEntity.ok(reviewService.getPublicReviewsByTarget(targetId, type, pageable));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByOrder(
            @PathVariable Long orderId,
            Pageable pageable) {
        log.info("Fetching reviews for order: {}", orderId);
        return ResponseEntity.ok(reviewService.getReviewsByOrder(orderId, pageable));
    }

    @GetMapping("/journey/{journeyId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByJourney(
            @PathVariable Long journeyId,
            Pageable pageable) {
        log.info("Fetching reviews for journey: {}", journeyId);
        return ResponseEntity.ok(reviewService.getReviewsByJourney(journeyId, pageable));
    }

    @GetMapping("/demand/{demandId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByDemand(
            @PathVariable Long demandId,
            Pageable pageable) {
        log.info("Fetching reviews for demand: {}", demandId);
        return ResponseEntity.ok(reviewService.getReviewsByDemand(demandId, pageable));
    }

    @GetMapping("/summary/target/{targetId}/type/{type}")
    public ResponseEntity<ReviewSummary> getReviewSummary(
            @PathVariable Long targetId,
            @PathVariable ReviewType type) {
        log.info("Fetching review summary for {} with id: {}", type, targetId);
        return ResponseEntity.ok(reviewService.getReviewSummary(targetId, type));
    }

    @PutMapping("/{reviewId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewResponse> approveReview(@PathVariable Long reviewId) {
        log.info("Approving review with id: {}", reviewId);
        return ResponseEntity.ok(reviewService.approveReview(reviewId));
    }

    @GetMapping("/pending-approval")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewResponse>> getReviewsPendingApproval() {
        log.info("Fetching reviews pending approval");
        return ResponseEntity.ok(reviewService.getReviewsPendingApproval());
    }

    @GetMapping("/has-reviewed")
    public ResponseEntity<Boolean> hasReviewed(
            @RequestParam Long reviewerId,
            @RequestParam Long targetId,
            @RequestParam ReviewType type) {
        log.info("Checking if user {} has reviewed {} {}", reviewerId, type, targetId);
        return ResponseEntity.ok(reviewService.hasReviewed(reviewerId, targetId, type));
    }
} 