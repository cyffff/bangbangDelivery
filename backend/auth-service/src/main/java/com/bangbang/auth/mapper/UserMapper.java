package com.bangbang.auth.mapper;

import com.bangbang.auth.dto.UserProfileDto;
import com.bangbang.auth.dto.UserRegistrationDto;
import com.bangbang.auth.entity.User;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

/**
 * Mapper for converting between User entity and DTOs.
 */
@Component
public class UserMapper {

    /**
     * Convert User entity to UserProfileDto.
     *
     * @param user the user entity
     * @return the user profile DTO
     */
    public UserProfileDto userToUserProfileDto(User user) {
        if (user == null) {
            return null;
        }

        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setCreditScore(user.getCreditScore());
        dto.setVerificationStatus(user.getVerificationStatus());

        // Map roles
        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    /**
     * Convert UserRegistrationDto to User entity.
     *
     * @param registrationDto the registration DTO
     * @return the user entity
     */
    public User userRegistrationDtoToUser(UserRegistrationDto registrationDto) {
        if (registrationDto == null) {
            return null;
        }

        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setPhoneNumber(registrationDto.getPhoneNumber());
        
        // Default values
        user.setVerificationStatus(0);
        user.setCreditScore(80);
        
        return user;
    }
} 