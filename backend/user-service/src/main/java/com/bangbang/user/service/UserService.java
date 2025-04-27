package com.bangbang.user.service;

import java.util.List;

import com.bangbang.user.dto.UserProfileDto;
import com.bangbang.user.dto.UserUpdateDto;

/**
 * Service interface for user management operations.
 */
public interface UserService {

    /**
     * Get a user profile by ID.
     *
     * @param id the user ID
     * @return the user profile
     * @throws com.bangbang.user.exception.ResourceNotFoundException if user not found
     */
    UserProfileDto getUserById(Long id);

    /**
     * Get a user profile by username.
     *
     * @param username the username
     * @return the user profile
     * @throws com.bangbang.user.exception.ResourceNotFoundException if user not found
     */
    UserProfileDto getUserByUsername(String username);

    /**
     * Get all users.
     *
     * @return a list of all user profiles
     */
    List<UserProfileDto> getAllUsers();

    /**
     * Update user information.
     *
     * @param id the user ID
     * @param userUpdateDto the user information to update
     * @return the updated user profile
     * @throws com.bangbang.user.exception.ResourceNotFoundException if user not found
     */
    UserProfileDto updateUser(Long id, UserUpdateDto userUpdateDto);

    /**
     * Delete a user by ID.
     *
     * @param id the user ID
     * @throws com.bangbang.user.exception.ResourceNotFoundException if user not found
     */
    void deleteUser(Long id);
} 