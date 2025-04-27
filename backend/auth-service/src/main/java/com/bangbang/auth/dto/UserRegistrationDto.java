package com.bangbang.auth.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDto {

    /**
     * Username for registration.
     */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    /**
     * Email for registration.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    /**
     * Password for registration.
     */
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    /**
     * First name.
     */
    @NotBlank(message = "First name is required")
    private String firstName;

    /**
     * Last name.
     */
    @NotBlank(message = "Last name is required")
    private String lastName;

    /**
     * Phone number.
     */
    @Pattern(regexp = "^\\+[0-9]{6,14}$", message = "Phone number should start with + followed by 6-14 digits")
    private String phoneNumber;
} 