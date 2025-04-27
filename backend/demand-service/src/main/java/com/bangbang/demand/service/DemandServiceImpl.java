package com.bangbang.demand.service;

import com.bangbang.demand.dto.CreateDemandRequest;
import com.bangbang.demand.dto.DemandDto;
import com.bangbang.demand.dto.UpdateDemandRequest;
import com.bangbang.demand.entity.Demand;
import com.bangbang.demand.exception.ResourceNotFoundException;
import com.bangbang.demand.exception.UnauthorizedException;
import com.bangbang.demand.mapper.DemandMapper;
import com.bangbang.demand.repository.DemandRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DemandServiceImpl implements DemandService {
    
    private final DemandRepository demandRepository;
    private final DemandMapper demandMapper;
    
    @Override
    public List<DemandDto> getAllDemands() {
        log.info("Fetching all demands");
        return demandRepository.findAll()
                .stream()
                .map(demandMapper::entityToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public DemandDto getDemandById(String id) {
        log.info("Fetching demand with id: {}", id);
        Demand demand = findDemandById(id);
        return demandMapper.entityToDto(demand);
    }
    
    @Override
    public List<DemandDto> getDemandsByUserId(String userId) {
        log.info("Fetching demands for user: {}", userId);
        return demandRepository.findByUserId(userId)
                .stream()
                .map(demandMapper::entityToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public DemandDto createDemand(CreateDemandRequest request, String userId) {
        log.info("Creating new demand for user: {}", userId);
        
        Demand demand = demandMapper.createRequestToEntity(request);
        demand.setUserId(userId);
        
        Demand savedDemand = demandRepository.save(demand);
        log.info("Demand created with id: {}", savedDemand.getId());
        
        return demandMapper.entityToDto(savedDemand);
    }
    
    @Override
    @Transactional
    public DemandDto updateDemand(String id, UpdateDemandRequest request, String userId) {
        log.info("Updating demand with id: {} for user: {}", id, userId);
        
        Demand demand = findDemandById(id);
        
        // Verify ownership
        if (!demand.getUserId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to update this demand");
        }
        
        // Only allow updates for demands that are not completed or cancelled
        if ("DELIVERED".equals(demand.getStatus()) || "CANCELLED".equals(demand.getStatus())) {
            throw new IllegalStateException("Cannot update a delivered or cancelled demand");
        }
        
        demandMapper.updateEntityFromRequest(request, demand);
        Demand updatedDemand = demandRepository.save(demand);
        
        return demandMapper.entityToDto(updatedDemand);
    }
    
    @Override
    @Transactional
    public void deleteDemand(String id, String userId) {
        log.info("Deleting demand with id: {} for user: {}", id, userId);
        
        Demand demand = findDemandById(id);
        
        // Verify ownership
        if (!demand.getUserId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this demand");
        }
        
        // Only allow deletion for demands that are in PENDING status
        if (!"PENDING".equals(demand.getStatus())) {
            throw new IllegalStateException("Can only delete demands in PENDING status");
        }
        
        demandRepository.deleteById(id);
        log.info("Demand with id: {} deleted successfully", id);
    }
    
    @Override
    @Transactional
    public DemandDto cancelDemand(String id, String userId) {
        log.info("Cancelling demand with id: {} for user: {}", id, userId);
        
        Demand demand = findDemandById(id);
        
        // Verify ownership
        if (!demand.getUserId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to cancel this demand");
        }
        
        // Only allow cancellation for demands that are not completed or already cancelled
        if ("DELIVERED".equals(demand.getStatus()) || "CANCELLED".equals(demand.getStatus())) {
            throw new IllegalStateException("Cannot cancel a delivered or already cancelled demand");
        }
        
        demand.setStatus("CANCELLED");
        Demand updatedDemand = demandRepository.save(demand);
        
        return demandMapper.entityToDto(updatedDemand);
    }
    
    @Override
    public List<DemandDto> searchDemands(String originCountry, String originCity,
                                      String destinationCountry, String destinationCity,
                                      String itemType, Double maxWeight, String status) {
        log.info("Searching for demands with filters");
        
        return demandRepository.searchDemands(
                originCountry, originCity, destinationCountry, destinationCity, itemType, maxWeight, status)
                .stream()
                .map(demandMapper::entityToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<DemandDto> getPopularDemands() {
        log.info("Fetching popular demands");
        
        return demandRepository.findPopularDemands()
                .stream()
                .map(demandMapper::entityToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public DemandDto incrementViewCount(String id) {
        log.info("Incrementing view count for demand: {}", id);
        
        Demand demand = findDemandById(id);
        demand.setViewCount(demand.getViewCount() + 1);
        Demand updatedDemand = demandRepository.save(demand);
        
        return demandMapper.entityToDto(updatedDemand);
    }
    
    private Demand findDemandById(String id) {
        return demandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demand not found with id: " + id));
    }
} 