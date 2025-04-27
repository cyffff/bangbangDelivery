package com.bangbang.matching.controller;

import com.bangbang.matching.dto.MatchConfirmRequest;
import com.bangbang.matching.dto.MatchDto;
import com.bangbang.matching.model.MatchStatus;
import com.bangbang.matching.service.MatchingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/matches")
@RequiredArgsConstructor
@Slf4j
public class MatchingController {

    private final MatchingService matchingService;

    @GetMapping
    public ResponseEntity<List<MatchDto>> getMatchesForCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return ResponseEntity.ok(matchingService.getMatchesByUserId(userId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<MatchDto>> getMatchesByStatusForCurrentUser(
            @PathVariable String status,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        MatchStatus matchStatus = MatchStatus.valueOf(status.toUpperCase());
        return ResponseEntity.ok(matchingService.getMatchesByStatusAndUserId(matchStatus, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchDto> getMatchById(@PathVariable Long id) {
        return ResponseEntity.ok(matchingService.getMatchById(id));
    }

    @GetMapping("/demand/{demandId}")
    public ResponseEntity<List<MatchDto>> getMatchesByDemandId(@PathVariable String demandId) {
        return ResponseEntity.ok(matchingService.getMatchesByDemandId(demandId));
    }

    @GetMapping("/journey/{journeyId}")
    public ResponseEntity<List<MatchDto>> getMatchesByJourneyId(@PathVariable Long journeyId) {
        return ResponseEntity.ok(matchingService.getMatchesByJourneyId(journeyId));
    }

    @PostMapping("/demand/{demandId}/find")
    public ResponseEntity<List<MatchDto>> findMatchesForDemand(
            @PathVariable String demandId,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Security check would be done in the service
        return ResponseEntity.ok(matchingService.findMatchesForDemand(demandId));
    }

    @PostMapping("/journey/{journeyId}/find")
    public ResponseEntity<List<MatchDto>> findMatchesForJourney(
            @PathVariable Long journeyId,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Security check would be done in the service
        return ResponseEntity.ok(matchingService.findMatchesForJourney(journeyId));
    }

    @PutMapping("/{id}/confirm/demander")
    public ResponseEntity<MatchDto> confirmMatchByDemander(
            @PathVariable Long id,
            @Valid @RequestBody MatchConfirmRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return ResponseEntity.ok(matchingService.confirmMatchByDemander(id, userId, request.getConfirmed()));
    }

    @PutMapping("/{id}/confirm/traveler")
    public ResponseEntity<MatchDto> confirmMatchByTraveler(
            @PathVariable Long id,
            @Valid @RequestBody MatchConfirmRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        // For travelers, the userId is a Long
        Long userId = Long.valueOf(userDetails.getUsername());
        return ResponseEntity.ok(matchingService.confirmMatchByTraveler(id, userId, request.getConfirmed()));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MatchDto> completeMatch(@PathVariable Long id) {
        return ResponseEntity.ok(matchingService.completeMatch(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<MatchDto> cancelMatch(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Authorization check would be done in the service
        return ResponseEntity.ok(matchingService.cancelMatch(id));
    }
} 