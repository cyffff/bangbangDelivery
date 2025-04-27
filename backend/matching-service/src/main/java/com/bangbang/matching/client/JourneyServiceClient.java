package com.bangbang.matching.client;

import com.bangbang.matching.dto.JourneyDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;

@FeignClient(name = "journey-service")
public interface JourneyServiceClient {
    
    @GetMapping("/api/v1/journeys/{id}")
    JourneyDto getJourneyById(@PathVariable("id") Long id);
    
    @GetMapping("/api/v1/journeys")
    List<JourneyDto> getAllJourneys();
    
    @GetMapping("/api/v1/journeys/user/{userId}")
    List<JourneyDto> getJourneysByUserId(@PathVariable("userId") Long userId);
    
    @GetMapping("/api/v1/journeys/status/{status}")
    List<JourneyDto> getJourneysByStatus(@PathVariable("status") String status);
    
    @GetMapping("/api/v1/journeys/search")
    List<JourneyDto> searchJourneys(
            @RequestParam(required = false) String fromCountry,
            @RequestParam(required = false) String fromCity,
            @RequestParam(required = false) String toCountry,
            @RequestParam(required = false) String toCity,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
            @RequestParam(required = false) String status);
    
    @GetMapping("/api/v1/journeys/upcoming")
    List<JourneyDto> getUpcomingJourneys();
} 