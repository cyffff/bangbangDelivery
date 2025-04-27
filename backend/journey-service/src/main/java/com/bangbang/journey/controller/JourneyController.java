package com.bangbang.journey.controller;

import com.bangbang.journey.dto.JourneyRequest;
import com.bangbang.journey.dto.JourneyResponse;
import com.bangbang.journey.model.JourneyStatus;
import com.bangbang.journey.service.JourneyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/journeys")
@RequiredArgsConstructor
@Slf4j
public class JourneyController {

    private final JourneyService journeyService;

    @GetMapping
    public ResponseEntity<List<JourneyResponse>> getAllJourneys() {
        return ResponseEntity.ok(journeyService.getAllJourneys());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JourneyResponse> getJourneyById(@PathVariable Long id) {
        return ResponseEntity.ok(journeyService.getJourneyById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<JourneyResponse>> getJourneysByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(journeyService.getJourneysByUserId(userId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<JourneyResponse>> getJourneysByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(journeyService.getJourneysByStatus(JourneyStatus.valueOf(status)));
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<JourneyResponse>> getJourneysByStatusAndUserId(
            @PathVariable Long userId,
            @PathVariable String status) {
        return ResponseEntity.ok(
                journeyService.getJourneysByStatusAndUserId(JourneyStatus.valueOf(status), userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<JourneyResponse>> searchJourneys(
            @RequestParam(required = false) String fromCountry,
            @RequestParam(required = false) String fromCity,
            @RequestParam(required = false) String toCountry,
            @RequestParam(required = false) String toCity,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
            @RequestParam(required = false) String status) {
        
        JourneyStatus journeyStatus = status != null ? JourneyStatus.valueOf(status) : null;
        
        return ResponseEntity.ok(journeyService.searchJourneys(
                fromCountry, fromCity, toCountry, toCity, departureDate, journeyStatus));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<JourneyResponse>> getUpcomingJourneys() {
        return ResponseEntity.ok(journeyService.getUpcomingJourneys());
    }

    @PostMapping
    public ResponseEntity<JourneyResponse> createJourney(
            @Valid @RequestBody JourneyRequest journeyRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Extract userId from authentication
        Long userId = Long.valueOf(userDetails.getUsername());
        
        JourneyResponse createdJourney = journeyService.createJourney(journeyRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJourney);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JourneyResponse> updateJourney(
            @PathVariable Long id,
            @Valid @RequestBody JourneyRequest journeyRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = Long.valueOf(userDetails.getUsername());
        
        return ResponseEntity.ok(journeyService.updateJourney(id, journeyRequest, userId));
    }

    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<JourneyResponse> updateJourneyStatus(
            @PathVariable Long id,
            @PathVariable String status,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = Long.valueOf(userDetails.getUsername());
        
        return ResponseEntity.ok(
                journeyService.updateJourneyStatus(id, JourneyStatus.valueOf(status), userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJourney(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = Long.valueOf(userDetails.getUsername());
        
        journeyService.deleteJourney(id, userId);
        return ResponseEntity.noContent().build();
    }
} 