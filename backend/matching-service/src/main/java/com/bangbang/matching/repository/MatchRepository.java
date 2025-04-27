package com.bangbang.matching.repository;

import com.bangbang.matching.model.Match;
import com.bangbang.matching.model.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByDemandUserId(String userId);
    
    List<Match> findByJourneyUserId(Long userId);
    
    List<Match> findByStatus(MatchStatus status);
    
    List<Match> findByDemandId(String demandId);
    
    List<Match> findByJourneyId(Long journeyId);
    
    Optional<Match> findByDemandIdAndJourneyId(String demandId, Long journeyId);
    
    @Query("SELECT m FROM Match m WHERE m.demandUserId = :userId OR m.journeyUserId = :userId")
    List<Match> findByUserId(@Param("userId") String userId);
    
    @Query("SELECT m FROM Match m WHERE m.status = :status AND (m.demandUserId = :userId OR m.journeyUserId = :userId)")
    List<Match> findByStatusAndUserId(@Param("status") MatchStatus status, @Param("userId") String userId);
    
    @Query("SELECT m FROM Match m WHERE m.status = :status AND m.demandUserId = :userId")
    List<Match> findByStatusAndDemandUserId(@Param("status") MatchStatus status, @Param("userId") String userId);
    
    @Query("SELECT m FROM Match m WHERE m.status = :status AND m.journeyUserId = :userId")
    List<Match> findByStatusAndJourneyUserId(@Param("status") MatchStatus status, @Param("userId") Long userId);
    
    @Query("SELECT m FROM Match m WHERE " +
           "m.demandId = :demandId AND " +
           "m.status IN ('PROPOSED', 'PENDING', 'CONFIRMED')")
    List<Match> findActiveMatchesByDemandId(@Param("demandId") String demandId);
    
    @Query("SELECT m FROM Match m WHERE " +
           "m.journeyId = :journeyId AND " +
           "m.status IN ('PROPOSED', 'PENDING', 'CONFIRMED')")
    List<Match> findActiveMatchesByJourneyId(@Param("journeyId") Long journeyId);
} 