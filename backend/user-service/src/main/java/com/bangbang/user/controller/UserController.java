package com.bangbang.user.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bangbang.user.dto.UserProfileDto;
import com.bangbang.user.dto.UserUpdateDto;
import com.bangbang.user.security.UserPrincipal;
import com.bangbang.user.service.UserService;

import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing users.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get the current user's profile.
     *
     * @param currentUser the authenticated user
     * @return the current user's profile
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserProfileDto userProfile = userService.getUserById(currentUser.getId());
        return ResponseEntity.ok(userProfile);
    }

    /**
     * Get all users.
     *
     * @return a list of all user profiles
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        List<UserProfileDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Get a user by ID.
     *
     * @param id the user ID
     * @return the user profile
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#id)")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable Long id) {
        UserProfileDto userProfile = userService.getUserById(id);
        return ResponseEntity.ok(userProfile);
    }

    /**
     * Get a user by username.
     *
     * @param username the username
     * @return the user profile
     */
    @GetMapping("/by-username/{username}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUsername(#username)")
    public ResponseEntity<UserProfileDto> getUserByUsername(@PathVariable String username) {
        UserProfileDto userProfile = userService.getUserByUsername(username);
        return ResponseEntity.ok(userProfile);
    }

    /**
     * Update a user's profile.
     *
     * @param id the user ID
     * @param userUpdateDto the user information to update
     * @param currentUser the authenticated user
     * @return the updated user profile
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#id)")
    public ResponseEntity<UserProfileDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDto userUpdateDto,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Additional security check for non-admin users
        if (!currentUser.getId().equals(id) && !currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        UserProfileDto updatedUser = userService.updateUser(id, userUpdateDto);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Delete a user.
     *
     * @param id the user ID
     * @return no content
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
} 