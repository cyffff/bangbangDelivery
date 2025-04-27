package com.bangbang.journey.service;

import com.bangbang.journey.dto.JourneyRequest;
import com.bangbang.journey.dto.JourneyResponse;
import com.bangbang.journey.exception.JourneyNotFoundException;
import com.bangbang.journey.exception.UnauthorizedAccessException;
import com.bangbang.journey.mapper.JourneyMapper;
import com.bangbang.journey.model.Journey;
import com.bangbang.journey.model.JourneyStatus;
import com.bangbang.journey.repository.JourneyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JourneyServiceImpl implements JourneyService {

    private final JourneyRepository journeyRepository;
    private final JourneyMapper journeyMapper;

    @Override
    @Transactional(readOnly = true)
    public List<JourneyResponse> getAllJourneys() {
        return journeyRepository.findAll().stream()
                .map(journeyMapper::journeyToJourneyResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public JourneyResponse getJourneyById(Long id) {
        Journey journey = findJourneyById(id);
        return journeyMapper.journeyToJourneyResponse(journey);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JourneyResponse> getJourneysByUserId(Long userId) {
        return journeyRepository.findByUserId(userId).stream()
                .map(journeyMapper::journeyToJourneyResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JourneyResponse> getJourneysByStatus(JourneyStatus status) {
        return journeyRepository.findByStatus(status).stream()
                .map(journeyMapper::journeyToJourneyResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JourneyResponse> getJourneysByStatusAndUserId(JourneyStatus status, Long userId) {
        return journeyRepository.findByStatusAndUserId(status, userId).stream()
                .map(journeyMapper::journeyToJourneyResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JourneyResponse> searchJourneys(
            String fromCountry, String fromCity, String toCountry, String toCity,
            LocalDate departureDate, JourneyStatus status) {
        
        return journeyRepository.searchJourneys(fromCountry, fromCity, toCountry, toCity, departureDate, status)
                .stream()
                .map(journeyMapper::journeyToJourneyResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JourneyResponse> getUpcomingJourneys() {
        return journeyRepository.findByDepartureDateGreaterThanEqualAndStatusOrderByDepartureDate(
                LocalDate.now(), JourneyStatus.ACTIVE)
                .stream()
                .map(journeyMapper::journeyToJourneyResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public JourneyResponse createJourney(JourneyRequest journeyRequest, Long userId) {
        Journey journey = journeyMapper.journeyRequestToJourney(journeyRequest);
        journey.setUserId(userId);
        
        Journey savedJourney = journeyRepository.save(journey);
        log.info("Created new journey with ID: {}", savedJourney.getId());
        
        return journeyMapper.journeyToJourneyResponse(savedJourney);
    }

    @Override
    @Transactional
    public JourneyResponse updateJourney(Long id, JourneyRequest journeyRequest, Long userId) {
        Journey journey = findJourneyByIdAndValidateOwnership(id, userId);
        
        journeyMapper.updateJourneyFromRequest(journeyRequest, journey);
        Journey updatedJourney = journeyRepository.save(journey);
        
        log.info("Updated journey with ID: {}", updatedJourney.getId());
        return journeyMapper.journeyToJourneyResponse(updatedJourney);
    }

    @Override
    @Transactional
    public JourneyResponse updateJourneyStatus(Long id, JourneyStatus status, Long userId) {
        Journey journey = findJourneyByIdAndValidateOwnership(id, userId);
        
        journey.setStatus(status);
        Journey updatedJourney = journeyRepository.save(journey);
        
        log.info("Updated journey status to {} for journey ID: {}", status, id);
        return journeyMapper.journeyToJourneyResponse(updatedJourney);
    }

    @Override
    @Transactional
    public void deleteJourney(Long id, Long userId) {
        Journey journey = findJourneyByIdAndValidateOwnership(id, userId);
        
        journeyRepository.delete(journey);
        log.info("Deleted journey with ID: {}", id);
    }

    private Journey findJourneyById(Long id) {
        return journeyRepository.findById(id)
                .orElseThrow(() -> new JourneyNotFoundException("Journey not found with ID: " + id));
    }

    private Journey findJourneyByIdAndValidateOwnership(Long id, Long userId) {
        Journey journey = findJourneyById(id);
        
        if (!journey.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("User does not have permission to access journey with ID: " + id);
        }
        
        return journey;
    }
} 