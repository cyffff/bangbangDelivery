package com.bangbang.auth.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user profile information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {

    /**
     * User ID.
     */
    private Long id;

    /**
     * Username.
     */
    private String username;

    /**
     * Email address.
     */
    private String email;

    /**
     * First name.
     */
    private String firstName;

    /**
     * Last name.
     */
    private String lastName;

    /**
     * Phone number.
     */
    private String phoneNumber;

    /**
     * User roles (e.g., "USER", "ADMIN").
     */
    private List<String> roles;

    /**
     * URL to profile image.
     */
    private String profileImageUrl;

    /**
     * User credit score.
     */
    private Integer creditScore;

    /**
     * Verification status.
     */
    private Integer verificationStatus;
} 