package com.bangbang.demand.repository;

import com.bangbang.demand.entity.Demand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandRepository extends JpaRepository<Demand, String> {
    List<Demand> findByUserId(String userId);
    
    List<Demand> findByStatus(String status);
    
    @Query("SELECT d FROM Demand d WHERE d.status = 'PENDING' ORDER BY d.viewCount DESC, d.createdAt DESC")
    List<Demand> findPopularDemands();
    
    @Query("SELECT d FROM Demand d WHERE " +
           "(:originCountry IS NULL OR d.originCountry = :originCountry) AND " +
           "(:originCity IS NULL OR d.originCity = :originCity) AND " +
           "(:destinationCountry IS NULL OR d.destinationCountry = :destinationCountry) AND " +
           "(:destinationCity IS NULL OR d.destinationCity = :destinationCity) AND " +
           "(:itemType IS NULL OR d.itemType = :itemType) AND " +
           "(:maxWeight IS NULL OR d.weightKg <= :maxWeight) AND " +
           "(:status IS NULL OR d.status = :status)")
    List<Demand> searchDemands(String originCountry, String originCity, 
                              String destinationCountry, String destinationCity,
                              String itemType, Double maxWeight, String status);
} 