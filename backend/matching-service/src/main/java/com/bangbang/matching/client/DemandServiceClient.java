package com.bangbang.matching.client;

import com.bangbang.matching.dto.DemandDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "demand-service")
public interface DemandServiceClient {
    
    @GetMapping("/api/v1/demands/{id}")
    DemandDto getDemandById(@PathVariable("id") String id);
    
    @GetMapping("/api/v1/demands")
    List<DemandDto> getAllDemands();
    
    @GetMapping("/api/v1/demands/user/{userId}")
    List<DemandDto> getDemandsByUserId(@PathVariable("userId") String userId);
    
    @GetMapping("/api/v1/demands/search")
    List<DemandDto> searchDemands(
            @RequestParam(required = false) String originCountry,
            @RequestParam(required = false) String originCity,
            @RequestParam(required = false) String destinationCountry,
            @RequestParam(required = false) String destinationCity,
            @RequestParam(required = false) String itemType,
            @RequestParam(required = false) Double maxWeight,
            @RequestParam(required = false) String status);
} 