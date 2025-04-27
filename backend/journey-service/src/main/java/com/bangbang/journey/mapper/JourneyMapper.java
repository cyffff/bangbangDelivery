package com.bangbang.journey.mapper;

import com.bangbang.journey.dto.JourneyRequest;
import com.bangbang.journey.dto.JourneyResponse;
import com.bangbang.journey.model.Journey;
import com.bangbang.journey.model.JourneyStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface JourneyMapper {

    JourneyMapper INSTANCE = Mappers.getMapper(JourneyMapper.class);

    @Mapping(target = "status", expression = "java(journey.getStatus().name())")
    JourneyResponse journeyToJourneyResponse(Journey journey);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "status", constant = "DRAFT")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Journey journeyRequestToJourney(JourneyRequest journeyRequest);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateJourneyFromRequest(JourneyRequest journeyRequest, @MappingTarget Journey journey);

    default JourneyStatus mapStatus(String status) {
        if (status == null) {
            return JourneyStatus.DRAFT;
        }
        return JourneyStatus.valueOf(status);
    }
} 