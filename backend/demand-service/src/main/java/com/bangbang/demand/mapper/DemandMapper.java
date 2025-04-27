package com.bangbang.demand.mapper;

import com.bangbang.demand.dto.CreateDemandRequest;
import com.bangbang.demand.dto.DemandDto;
import com.bangbang.demand.dto.UpdateDemandRequest;
import com.bangbang.demand.entity.Demand;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DemandMapper {
    
    DemandDto entityToDto(Demand demand);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "viewCount", constant = "0")
    Demand createRequestToEntity(CreateDemandRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(UpdateDemandRequest request, @MappingTarget Demand demand);
} 