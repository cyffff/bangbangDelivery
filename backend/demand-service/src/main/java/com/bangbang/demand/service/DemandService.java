package com.bangbang.demand.service;

import com.bangbang.demand.dto.CreateDemandRequest;
import com.bangbang.demand.dto.DemandDto;
import com.bangbang.demand.dto.UpdateDemandRequest;

import java.util.List;

public interface DemandService {
    List<DemandDto> getAllDemands();
    
    DemandDto getDemandById(String id);
    
    List<DemandDto> getDemandsByUserId(String userId);
    
    DemandDto createDemand(CreateDemandRequest request, String userId);
    
    DemandDto updateDemand(String id, UpdateDemandRequest request, String userId);
    
    void deleteDemand(String id, String userId);
    
    DemandDto cancelDemand(String id, String userId);
    
    List<DemandDto> searchDemands(String originCountry, String originCity,
                                 String destinationCountry, String destinationCity,
                                 String itemType, Double maxWeight, String status);
    
    List<DemandDto> getPopularDemands();
    
    DemandDto incrementViewCount(String id);
} 