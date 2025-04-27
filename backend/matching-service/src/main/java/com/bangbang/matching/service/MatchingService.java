package com.bangbang.matching.service;

import com.bangbang.matching.dto.MatchDto;
import com.bangbang.matching.model.MatchStatus;

import java.util.List;

public interface MatchingService {

    /**
     * Find all matches for a user (both as demander and traveler)
     */
    List<MatchDto> getMatchesByUserId(String userId);

    /**
     * Find matches by status for a user
     */
    List<MatchDto> getMatchesByStatusAndUserId(MatchStatus status, String userId);

    /**
     * Get matches for a specific demand
     */
    List<MatchDto> getMatchesByDemandId(String demandId);

    /**
     * Get matches for a specific journey
     */
    List<MatchDto> getMatchesByJourneyId(Long journeyId);
    
    /**
     * Get a specific match by ID
     */
    MatchDto getMatchById(Long matchId);
    
    /**
     * Run the matching algorithm to find potential journeys for a demand
     */
    List<MatchDto> findMatchesForDemand(String demandId);
    
    /**
     * Run the matching algorithm to find potential demands for a journey
     */
    List<MatchDto> findMatchesForJourney(Long journeyId);
    
    /**
     * Confirm a match from the demander's side
     */
    MatchDto confirmMatchByDemander(Long matchId, String userId, boolean confirmed);
    
    /**
     * Confirm a match from the traveler's side
     */
    MatchDto confirmMatchByTraveler(Long matchId, Long userId, boolean confirmed);
    
    /**
     * Mark a match as completed
     */
    MatchDto completeMatch(Long matchId);
    
    /**
     * Cancel a confirmed match
     */
    MatchDto cancelMatch(Long matchId);
} 