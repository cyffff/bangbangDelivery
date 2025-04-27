package com.bangbang.demand.controller;

import com.bangbang.demand.dto.CreateDemandRequest;
import com.bangbang.demand.dto.DemandDto;
import com.bangbang.demand.dto.UpdateDemandRequest;
import com.bangbang.demand.service.DemandService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/demands")
@RequiredArgsConstructor
@Slf4j
public class DemandController {
    
    private final DemandService demandService;
    
    @GetMapping
    public ResponseEntity<List<DemandDto>> getAllDemands() {
        return ResponseEntity.ok(demandService.getAllDemands());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DemandDto> getDemandById(@PathVariable String id) {
        // Increment view count when demand is viewed
        return ResponseEntity.ok(demandService.incrementViewCount(id));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DemandDto>> getDemandsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(demandService.getDemandsByUserId(userId));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<DemandDto>> searchDemands(
            @RequestParam(required = false) String originCountry,
            @RequestParam(required = false) String originCity,
            @RequestParam(required = false) String destinationCountry,
            @RequestParam(required = false) String destinationCity,
            @RequestParam(required = false) String itemType,
            @RequestParam(required = false) Double maxWeight,
            @RequestParam(required = false) String status) {
        
        return ResponseEntity.ok(demandService.searchDemands(
                originCountry, originCity, destinationCountry, destinationCity, itemType, maxWeight, status));
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<DemandDto>> getPopularDemands() {
        return ResponseEntity.ok(demandService.getPopularDemands());
    }
    
    @PostMapping
    public ResponseEntity<DemandDto> createDemand(
            @Valid @RequestBody CreateDemandRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        DemandDto createdDemand = demandService.createDemand(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDemand);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DemandDto> updateDemand(
            @PathVariable String id,
            @Valid @RequestBody UpdateDemandRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        return ResponseEntity.ok(demandService.updateDemand(id, request, userDetails.getUsername()));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemand(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        demandService.deleteDemand(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<DemandDto> cancelDemand(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        return ResponseEntity.ok(demandService.cancelDemand(id, userDetails.getUsername()));
    }
} 