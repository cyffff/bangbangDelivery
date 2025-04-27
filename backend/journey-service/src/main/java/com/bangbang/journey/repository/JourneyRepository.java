package com.bangbang.journey.repository;

import com.bangbang.journey.model.Journey;
import com.bangbang.journey.model.JourneyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JourneyRepository extends JpaRepository<Journey, Long> {

    List<Journey> findByUserId(Long userId);
    
    List<Journey> findByStatus(JourneyStatus status);
    
    @Query("SELECT j FROM Journey j WHERE j.status = :status AND j.userId = :userId")
    List<Journey> findByStatusAndUserId(@Param("status") JourneyStatus status, @Param("userId") Long userId);
    
    @Query("SELECT j FROM Journey j WHERE " +
           "(:fromCountry IS NULL OR j.fromCountry = :fromCountry) AND " +
           "(:fromCity IS NULL OR j.fromCity = :fromCity) AND " +
           "(:toCountry IS NULL OR j.toCountry = :toCountry) AND " +
           "(:toCity IS NULL OR j.toCity = :toCity) AND " +
           "(:departureDate IS NULL OR j.departureDate >= :departureDate) AND " +
           "(:status IS NULL OR j.status = :status)")
    List<Journey> searchJourneys(
            @Param("fromCountry") String fromCountry,
            @Param("fromCity") String fromCity,
            @Param("toCountry") String toCountry,
            @Param("toCity") String toCity,
            @Param("departureDate") LocalDate departureDate,
            @Param("status") JourneyStatus status);
    
    List<Journey> findByDepartureDateGreaterThanEqualAndStatusOrderByDepartureDate(LocalDate fromDate, JourneyStatus status);
} 