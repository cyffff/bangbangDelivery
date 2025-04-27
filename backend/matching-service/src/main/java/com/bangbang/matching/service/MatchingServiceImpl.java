package com.bangbang.matching.service;

import com.bangbang.matching.client.DemandServiceClient;
import com.bangbang.matching.client.JourneyServiceClient;
import com.bangbang.matching.dto.DemandDto;
import com.bangbang.matching.dto.JourneyDto;
import com.bangbang.matching.dto.MatchDto;
import com.bangbang.matching.exception.InvalidMatchStateException;
import com.bangbang.matching.exception.MatchNotFoundException;
import com.bangbang.matching.exception.UnauthorizedException;
import com.bangbang.matching.mapper.MatchMapper;
import com.bangbang.matching.model.Match;
import com.bangbang.matching.model.MatchStatus;
import com.bangbang.matching.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingServiceImpl implements MatchingService {

    private final MatchRepository matchRepository;
    private final DemandServiceClient demandServiceClient;
    private final JourneyServiceClient journeyServiceClient;
    private final MatchMapper matchMapper;

    @Override
    @Transactional(readOnly = true)
    public List<MatchDto> getMatchesByUserId(String userId) {
        List<Match> matches = matchRepository.findByUserId(userId);
        return enhanceMatchesWithDetails(matches);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchDto> getMatchesByStatusAndUserId(MatchStatus status, String userId) {
        List<Match> matches = matchRepository.findByStatusAndUserId(status, userId);
        return enhanceMatchesWithDetails(matches);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchDto> getMatchesByDemandId(String demandId) {
        List<Match> matches = matchRepository.findByDemandId(demandId);
        return enhanceMatchesWithDetails(matches);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchDto> getMatchesByJourneyId(Long journeyId) {
        List<Match> matches = matchRepository.findByJourneyId(journeyId);
        return enhanceMatchesWithDetails(matches);
    }

    @Override
    @Transactional(readOnly = true)
    public MatchDto getMatchById(Long matchId) {
        Match match = findMatchById(matchId);
        return enhanceMatchWithDetails(matchMapper.matchToMatchDto(match));
    }

    @Override
    @Transactional
    public List<MatchDto> findMatchesForDemand(String demandId) {
        log.info("Finding matches for demand: {}", demandId);
        
        // 1. Get the demand
        DemandDto demand = demandServiceClient.getDemandById(demandId);
        
        // 2. Check if demand is in valid status
        if (!"PENDING".equals(demand.getStatus())) {
            throw new InvalidMatchStateException("Demand must be in PENDING status to find matches");
        }
        
        // 3. Get existing active matches for this demand to avoid duplicates
        Set<Long> existingMatchedJourneyIds = matchRepository.findActiveMatchesByDemandId(demandId).stream()
                .map(Match::getJourneyId)
                .collect(Collectors.toSet());
        
        // 4. Find potential journeys using the algorithm
        List<JourneyDto> potentialJourneys = findPotentialJourneysForDemand(demand, existingMatchedJourneyIds);
        
        // 5. Calculate match scores and create match records
        List<Match> newMatches = new ArrayList<>();
        for (JourneyDto journey : potentialJourneys) {
            double matchScore = calculateMatchScore(demand, journey);
            if (matchScore >= 0.5) { // Only create matches with a minimum score
                Match match = Match.builder()
                        .demandId(demand.getId())
                        .journeyId(journey.getId())
                        .demandUserId(demand.getUserId())
                        .journeyUserId(journey.getUserId())
                        .status(MatchStatus.PROPOSED)
                        .matchScore(matchScore)
                        .demanderConfirmed(false)
                        .travelerConfirmed(false)
                        .build();
                newMatches.add(match);
            }
        }
        
        // 6. Save new matches
        if (!newMatches.isEmpty()) {
            newMatches = matchRepository.saveAll(newMatches);
            log.info("Created {} new matches for demand {}", newMatches.size(), demandId);
        }
        
        // 7. Return all matches for this demand including existing ones
        return enhanceMatchesWithDetails(matchRepository.findByDemandId(demandId));
    }

    @Override
    @Transactional
    public List<MatchDto> findMatchesForJourney(Long journeyId) {
        log.info("Finding matches for journey: {}", journeyId);
        
        // 1. Get the journey
        JourneyDto journey = journeyServiceClient.getJourneyById(journeyId);
        
        // 2. Check if journey is in valid status
        if (!"ACTIVE".equals(journey.getStatus())) {
            throw new InvalidMatchStateException("Journey must be in ACTIVE status to find matches");
        }
        
        // 3. Get existing active matches for this journey to avoid duplicates
        Set<String> existingMatchedDemandIds = matchRepository.findActiveMatchesByJourneyId(journeyId).stream()
                .map(Match::getDemandId)
                .collect(Collectors.toSet());
        
        // 4. Find potential demands using the algorithm
        List<DemandDto> potentialDemands = findPotentialDemandsForJourney(journey, existingMatchedDemandIds);
        
        // 5. Calculate match scores and create match records
        List<Match> newMatches = new ArrayList<>();
        for (DemandDto demand : potentialDemands) {
            double matchScore = calculateMatchScore(demand, journey);
            if (matchScore >= 0.5) { // Only create matches with a minimum score
                Match match = Match.builder()
                        .demandId(demand.getId())
                        .journeyId(journey.getId())
                        .demandUserId(demand.getUserId())
                        .journeyUserId(journey.getUserId())
                        .status(MatchStatus.PROPOSED)
                        .matchScore(matchScore)
                        .demanderConfirmed(false)
                        .travelerConfirmed(false)
                        .build();
                newMatches.add(match);
            }
        }
        
        // 6. Save new matches
        if (!newMatches.isEmpty()) {
            newMatches = matchRepository.saveAll(newMatches);
            log.info("Created {} new matches for journey {}", newMatches.size(), journeyId);
        }
        
        // 7. Return all matches for this journey including existing ones
        return enhanceMatchesWithDetails(matchRepository.findByJourneyId(journeyId));
    }

    @Override
    @Transactional
    public MatchDto confirmMatchByDemander(Long matchId, String userId, boolean confirmed) {
        log.info("Demander {} {} match {}", userId, confirmed ? "confirming" : "rejecting", matchId);
        
        Match match = findMatchById(matchId);
        
        // Check authorization
        if (!match.getDemandUserId().equals(userId)) {
            throw new UnauthorizedException("User is not authorized to confirm this match");
        }
        
        // Check match state
        if (match.getStatus() != MatchStatus.PROPOSED && match.getStatus() != MatchStatus.PENDING) {
            throw new InvalidMatchStateException("Match is not in a confirmable state");
        }
        
        if (confirmed) {
            match.setDemanderConfirmed(true);
            
            // If traveler already confirmed, set to CONFIRMED
            if (Boolean.TRUE.equals(match.getTravelerConfirmed())) {
                match.setStatus(MatchStatus.CONFIRMED);
                match.setConfirmedAt(LocalDateTime.now());
            } else {
                match.setStatus(MatchStatus.PENDING);
            }
        } else {
            match.setStatus(MatchStatus.REJECTED);
            match.setRejectedAt(LocalDateTime.now());
        }
        
        Match updatedMatch = matchRepository.save(match);
        return enhanceMatchWithDetails(matchMapper.matchToMatchDto(updatedMatch));
    }

    @Override
    @Transactional
    public MatchDto confirmMatchByTraveler(Long matchId, Long userId, boolean confirmed) {
        log.info("Traveler {} {} match {}", userId, confirmed ? "confirming" : "rejecting", matchId);
        
        Match match = findMatchById(matchId);
        
        // Check authorization
        if (!match.getJourneyUserId().equals(userId)) {
            throw new UnauthorizedException("User is not authorized to confirm this match");
        }
        
        // Check match state
        if (match.getStatus() != MatchStatus.PROPOSED && match.getStatus() != MatchStatus.PENDING) {
            throw new InvalidMatchStateException("Match is not in a confirmable state");
        }
        
        if (confirmed) {
            match.setTravelerConfirmed(true);
            
            // If demander already confirmed, set to CONFIRMED
            if (Boolean.TRUE.equals(match.getDemanderConfirmed())) {
                match.setStatus(MatchStatus.CONFIRMED);
                match.setConfirmedAt(LocalDateTime.now());
            } else {
                match.setStatus(MatchStatus.PENDING);
            }
        } else {
            match.setStatus(MatchStatus.REJECTED);
            match.setRejectedAt(LocalDateTime.now());
        }
        
        Match updatedMatch = matchRepository.save(match);
        return enhanceMatchWithDetails(matchMapper.matchToMatchDto(updatedMatch));
    }

    @Override
    @Transactional
    public MatchDto completeMatch(Long matchId) {
        log.info("Completing match {}", matchId);
        
        Match match = findMatchById(matchId);
        
        // Check match state
        if (match.getStatus() != MatchStatus.CONFIRMED) {
            throw new InvalidMatchStateException("Match must be in CONFIRMED status to be completed");
        }
        
        match.setStatus(MatchStatus.COMPLETED);
        Match updatedMatch = matchRepository.save(match);
        
        return enhanceMatchWithDetails(matchMapper.matchToMatchDto(updatedMatch));
    }

    @Override
    @Transactional
    public MatchDto cancelMatch(Long matchId) {
        log.info("Cancelling match {}", matchId);
        
        Match match = findMatchById(matchId);
        
        // Check match state
        if (match.getStatus() != MatchStatus.CONFIRMED) {
            throw new InvalidMatchStateException("Match must be in CONFIRMED status to be cancelled");
        }
        
        match.setStatus(MatchStatus.CANCELLED);
        Match updatedMatch = matchRepository.save(match);
        
        return enhanceMatchWithDetails(matchMapper.matchToMatchDto(updatedMatch));
    }

    // Private helper methods

    private Match findMatchById(Long matchId) {
        return matchRepository.findById(matchId)
                .orElseThrow(() -> new MatchNotFoundException("Match not found with id: " + matchId));
    }

    private List<MatchDto> enhanceMatchesWithDetails(List<Match> matches) {
        if (matches.isEmpty()) {
            return Collections.emptyList();
        }
        
        // Collect all demand ids and journey ids
        Set<String> demandIds = matches.stream().map(Match::getDemandId).collect(Collectors.toSet());
        Set<Long> journeyIds = matches.stream().map(Match::getJourneyId).collect(Collectors.toSet());
        
        // Batch fetch demands and journeys
        Map<String, DemandDto> demandMap = fetchDemandsById(demandIds);
        Map<Long, JourneyDto> journeyMap = fetchJourneysById(journeyIds);
        
        // Map to DTOs and enhance with details
        return matches.stream()
                .map(matchMapper::matchToMatchDto)
                .peek(dto -> {
                    dto.setDemand(demandMap.get(dto.getDemandId()));
                    dto.setJourney(journeyMap.get(dto.getJourneyId()));
                })
                .collect(Collectors.toList());
    }

    private MatchDto enhanceMatchWithDetails(MatchDto matchDto) {
        try {
            matchDto.setDemand(demandServiceClient.getDemandById(matchDto.getDemandId()));
            matchDto.setJourney(journeyServiceClient.getJourneyById(matchDto.getJourneyId()));
        } catch (Exception e) {
            log.error("Error fetching demand or journey details for match {}", matchDto.getId(), e);
        }
        return matchDto;
    }

    private Map<String, DemandDto> fetchDemandsById(Set<String> demandIds) {
        try {
            return demandIds.stream()
                    .map(demandServiceClient::getDemandById)
                    .collect(Collectors.toMap(DemandDto::getId, Function.identity()));
        } catch (Exception e) {
            log.error("Error batch fetching demands", e);
            return Collections.emptyMap();
        }
    }

    private Map<Long, JourneyDto> fetchJourneysById(Set<Long> journeyIds) {
        try {
            return journeyIds.stream()
                    .map(journeyServiceClient::getJourneyById)
                    .collect(Collectors.toMap(JourneyDto::getId, Function.identity()));
        } catch (Exception e) {
            log.error("Error batch fetching journeys", e);
            return Collections.emptyMap();
        }
    }

    private List<JourneyDto> findPotentialJourneysForDemand(DemandDto demand, Set<Long> existingMatchedJourneyIds) {
        // Only find journeys that are in ACTIVE status and have future departure dates
        List<JourneyDto> activeJourneys = journeyServiceClient.getJourneysByStatus("ACTIVE");
        
        return activeJourneys.stream()
                // Filter out journeys already matched
                .filter(journey -> !existingMatchedJourneyIds.contains(journey.getId()))
                // Basic route matching
                .filter(journey -> routeMatches(
                        demand.getOriginCountry(), demand.getOriginCity(),
                        demand.getDestinationCountry(), demand.getDestinationCity(),
                        journey.getFromCountry(), journey.getFromCity(),
                        journey.getToCountry(), journey.getToCity()))
                // Check item weight constraints
                .filter(journey -> journey.getAvailableWeight() >= demand.getWeightKg())
                // Check dates - journey must depart before the demand deadline
                .filter(journey -> journey.getDepartureDate().isBefore(demand.getDeadline()))
                // Check if the journey allows the item type (if preferredItemTypes is specified)
                .filter(journey -> journey.getPreferredItemTypes() == null 
                        || journey.getPreferredItemTypes().isEmpty()
                        || journey.getPreferredItemTypes().contains(demand.getItemType()))
                .collect(Collectors.toList());
    }

    private List<DemandDto> findPotentialDemandsForJourney(JourneyDto journey, Set<String> existingMatchedDemandIds) {
        // Only find demands that are in PENDING status
        List<DemandDto> pendingDemands = demandServiceClient.searchDemands(null, null, null, null, null, null, "PENDING");
        
        LocalDate journeyDeparture = journey.getDepartureDate();
        
        return pendingDemands.stream()
                // Filter out demands already matched
                .filter(demand -> !existingMatchedDemandIds.contains(demand.getId()))
                // Basic route matching
                .filter(demand -> routeMatches(
                        demand.getOriginCountry(), demand.getOriginCity(),
                        demand.getDestinationCountry(), demand.getDestinationCity(),
                        journey.getFromCountry(), journey.getFromCity(),
                        journey.getToCountry(), journey.getToCity()))
                // Check item weight constraints
                .filter(demand -> journey.getAvailableWeight() >= demand.getWeightKg())
                // Check dates - journey must depart before the demand deadline
                .filter(demand -> journeyDeparture.isBefore(demand.getDeadline()))
                // Check if the journey allows the item type (if preferredItemTypes is specified)
                .filter(demand -> journey.getPreferredItemTypes() == null 
                        || journey.getPreferredItemTypes().isEmpty()
                        || journey.getPreferredItemTypes().contains(demand.getItemType()))
                .collect(Collectors.toList());
    }

    private boolean routeMatches(
            String demandOriginCountry, String demandOriginCity,
            String demandDestCountry, String demandDestCity,
            String journeyFromCountry, String journeyFromCity,
            String journeyToCountry, String journeyToCity) {
        
        // Country must match exactly
        boolean originCountryMatch = demandOriginCountry.equalsIgnoreCase(journeyFromCountry);
        boolean destCountryMatch = demandDestCountry.equalsIgnoreCase(journeyToCountry);
        
        // For cities, we check exact match or null (for flexibility)
        boolean originCityMatch = demandOriginCity.equalsIgnoreCase(journeyFromCity);
        boolean destCityMatch = demandDestCity.equalsIgnoreCase(journeyToCity);
        
        return originCountryMatch && destCountryMatch && originCityMatch && destCityMatch;
    }

    private double calculateMatchScore(DemandDto demand, JourneyDto journey) {
        // Base score starts at 0.6 if routes match
        double score = 0.6;
        
        // Route matching already verified, now we calculate additional score factors
        
        // 1. Weight capacity - more available weight is better (up to 0.1)
        double weightRatio = Math.min(1.0, (journey.getAvailableWeight() / demand.getWeightKg()));
        score += 0.1 * weightRatio;
        
        // 2. Item type preference match (up to 0.1)
        if (journey.getPreferredItemTypes() != null 
                && !journey.getPreferredItemTypes().isEmpty()
                && journey.getPreferredItemTypes().contains(demand.getItemType())) {
            score += 0.1;
        }
        
        // 3. Time factor - if journey is well before deadline (up to 0.1)
        long daysBeforeDeadline = Math.max(0, 
                demand.getDeadline().toEpochDay() - journey.getDepartureDate().toEpochDay());
        // Max score for 7+ days before deadline
        score += Math.min(0.1, daysBeforeDeadline * 0.015);
        
        // 4. Proximity bonus for city match (up to 0.1)
        if (demand.getOriginCity().equalsIgnoreCase(journey.getFromCity()) 
                && demand.getDestinationCity().equalsIgnoreCase(journey.getToCity())) {
            score += 0.1;
        }
        
        // Ensure score is between 0 and 1
        return Math.min(1.0, Math.max(0.0, score));
    }
} 