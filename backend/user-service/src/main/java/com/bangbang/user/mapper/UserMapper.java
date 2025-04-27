package com.bangbang.user.mapper;

import com.bangbang.user.dto.UserProfileDto;
import com.bangbang.user.dto.UserRegistrationDto;
import com.bangbang.user.entity.Role;
import com.bangbang.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper interface for converting between User entity and DTOs.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * Maps User entity to UserProfileDto.
     * 
     * @param user the user entity
     * @return the user profile DTO
     */
    @Mapping(source = "roles", target = "roles", qualifiedByName = "rolesToStringSet")
    UserProfileDto userToUserProfileDto(User user);
    
    /**
     * Maps UserRegistrationDto to User entity.
     * Note: password is not mapped directly to avoid security issues.
     * 
     * @param registrationDto the registration DTO
     * @return the user entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User userRegistrationDtoToUser(UserRegistrationDto registrationDto);
    
    /**
     * Converts a set of Role entities to a set of role names.
     * 
     * @param roles the set of roles
     * @return a set of role names
     */
    @Named("rolesToStringSet")
    default Set<String> rolesToStringSet(Set<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }
} 