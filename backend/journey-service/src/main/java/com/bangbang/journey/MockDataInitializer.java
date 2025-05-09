package com.bangbang.journey;

import com.bangbang.journey.model.Journey;
import com.bangbang.journey.model.JourneyStatus;
import com.bangbang.journey.repository.JourneyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Initializes mock journey data for development and testing purposes.
 * This component runs on application startup and populates the database with sample journey data.
 */
@Component
@Profile({"dev", "docker"})
@RequiredArgsConstructor
@Slf4j
public class MockDataInitializer implements ApplicationRunner {

    private final JourneyRepository journeyRepository;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Initializing mock journey data");

        // Check if data already exists
        if (journeyRepository.count() > 0) {
            log.info("Mock data already exists. Skipping initialization.");
            return;
        }

        // Create sample journey data
        List<Journey> journeys = Arrays.asList(
            // Journey 1: New York to London
            Journey.builder()
                .userId(1L)
                .fromCountry("USA")
                .fromCity("New York")
                .toCountry("UK")
                .toCity("London")
                .departureDate(LocalDate.now().plusDays(10))
                .arrivalDate(LocalDate.now().plusDays(11))
                .availableWeight(20.0)
                .availableVolume(15.0)
                .notes("Direct flight. Can carry electronics and small items.")
                .preferredItemTypes(new HashSet<>(Set.of("Electronics", "Documents", "Clothing")))
                .status(JourneyStatus.ACTIVE)
                .createdAt(LocalDateTime.now().minusDays(5))
                .updatedAt(LocalDateTime.now().minusDays(5))
                .build(),

            // Journey 2: Paris to Barcelona
            Journey.builder()
                .userId(2L)
                .fromCountry("France")
                .fromCity("Paris")
                .toCountry("Spain")
                .toCity("Barcelona")
                .departureDate(LocalDate.now().plusDays(15))
                .arrivalDate(LocalDate.now().plusDays(15))
                .availableWeight(8.0)
                .availableVolume(10.0)
                .notes("Train journey. No liquids or fragile items please.")
                .preferredItemTypes(new HashSet<>(Set.of("Books", "Clothing", "Food")))
                .status(JourneyStatus.ACTIVE)
                .createdAt(LocalDateTime.now().minusDays(3))
                .updatedAt(LocalDateTime.now().minusDays(3))
                .build(),

            // Journey 3: Tokyo to Seoul
            Journey.builder()
                .userId(3L)
                .fromCountry("Japan")
                .fromCity("Tokyo")
                .toCountry("South Korea")
                .toCity("Seoul")
                .departureDate(LocalDate.now().plusDays(7))
                .arrivalDate(LocalDate.now().plusDays(7))
                .availableWeight(5.0)
                .availableVolume(7.0)
                .notes("Short flight. Can carry small electronics or cosmetics.")
                .preferredItemTypes(new HashSet<>(Set.of("Electronics", "Cosmetics")))
                .status(JourneyStatus.ACTIVE)
                .createdAt(LocalDateTime.now().minusDays(10))
                .updatedAt(LocalDateTime.now().minusDays(10))
                .build(),

            // Journey 4: Dubai to Mumbai
            Journey.builder()
                .userId(2L)
                .fromCountry("UAE")
                .fromCity("Dubai")
                .toCountry("India")
                .toCity("Mumbai")
                .departureDate(LocalDate.now().plusDays(20))
                .arrivalDate(LocalDate.now().plusDays(20))
                .availableWeight(15.0)
                .availableVolume(12.0)
                .notes("Direct flight. Can carry various items including electronics.")
                .preferredItemTypes(new HashSet<>(Set.of("Electronics", "Clothing", "Accessories")))
                .status(JourneyStatus.ACTIVE)
                .createdAt(LocalDateTime.now().minusDays(2))
                .updatedAt(LocalDateTime.now().minusDays(2))
                .build(),

            // Journey 5: Completed journey (Singapore to Bangkok)
            Journey.builder()
                .userId(1L)
                .fromCountry("Singapore")
                .fromCity("Singapore")
                .toCountry("Thailand")
                .toCity("Bangkok")
                .departureDate(LocalDate.now().minusDays(15))
                .arrivalDate(LocalDate.now().minusDays(15))
                .availableWeight(10.0)
                .availableVolume(8.0)
                .notes("Completed journey. Successfully delivered all items.")
                .preferredItemTypes(new HashSet<>(Set.of("Food", "Clothing")))
                .status(JourneyStatus.COMPLETED)
                .createdAt(LocalDateTime.now().minusDays(30))
                .updatedAt(LocalDateTime.now().minusDays(14))
                .build()
        );

        // Save all journeys to the database
        journeyRepository.saveAll(journeys);
        log.info("Mock journey data initialized with {} journeys", journeys.size());
    }
} 