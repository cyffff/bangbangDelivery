package com.bangbang.user.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for user profile updates.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {

    @Size(min = 3, max = 50)
    private String username;
    
    @Size(max = 100)
    @Email
    private String email;
    
    @Size(max = 50)
    private String firstName;
    
    @Size(max = 50)
    private String lastName;
    
    @Size(max = 20)
    private String phoneNumber;
    
    /**
     * Current password needed for security-sensitive updates.
     */
    private String currentPassword;
    
    /**
     * New password if the user wants to change it.
     */
    @Size(min = 6, max = 100)
    private String newPassword;
} 