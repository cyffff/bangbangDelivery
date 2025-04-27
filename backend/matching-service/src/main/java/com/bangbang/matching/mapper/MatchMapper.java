package com.bangbang.matching.mapper;

import com.bangbang.matching.dto.MatchDto;
import com.bangbang.matching.model.Match;
import com.bangbang.matching.model.MatchStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface MatchMapper {

    @Mapping(target = "status", source = "status", qualifiedByName = "statusToString")
    @Mapping(target = "demand", ignore = true)
    @Mapping(target = "journey", ignore = true)
    MatchDto matchToMatchDto(Match match);

    @Mapping(target = "status", source = "status", qualifiedByName = "stringToStatus")
    Match matchDtoToMatch(MatchDto matchDto);

    @Named("statusToString")
    default String statusToString(MatchStatus status) {
        return status != null ? status.name() : null;
    }

    @Named("stringToStatus")
    default MatchStatus stringToStatus(String status) {
        return status != null ? MatchStatus.valueOf(status) : null;
    }
} 