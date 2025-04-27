package com.bangbang.journey.service;

import com.bangbang.journey.dto.JourneyRequest;
import com.bangbang.journey.dto.JourneyResponse;
import com.bangbang.journey.model.JourneyStatus;

import java.time.LocalDate;
import java.util.List;

public interface JourneyService {

    List<JourneyResponse> getAllJourneys();
    
    JourneyResponse getJourneyById(Long id);
    
    List<JourneyResponse> getJourneysByUserId(Long userId);
    
    List<JourneyResponse> getJourneysByStatus(JourneyStatus status);
    
    List<JourneyResponse> getJourneysByStatusAndUserId(JourneyStatus status, Long userId);
    
    List<JourneyResponse> searchJourneys(
            String fromCountry,
            String fromCity,
            String toCountry,
            String toCity,
            LocalDate departureDate,
            JourneyStatus status);
    
    List<JourneyResponse> getUpcomingJourneys();
    
    JourneyResponse createJourney(JourneyRequest journeyRequest, Long userId);
    
    JourneyResponse updateJourney(Long id, JourneyRequest journeyRequest, Long userId);
    
    JourneyResponse updateJourneyStatus(Long id, JourneyStatus status, Long userId);
    
    void deleteJourney(Long id, Long userId);
} 