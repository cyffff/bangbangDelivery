package com.bangbang.user.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.bangbang.user.dto.UserProfileDto;
import com.bangbang.user.dto.UserUpdateDto;
import com.bangbang.user.security.UserPrincipal;
import com.bangbang.user.service.SecurityService;
import com.bangbang.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private SecurityService securityService;

    private UserProfileDto testUserProfileDto;
    private UserUpdateDto testUserUpdateDto;

    @BeforeEach
    void setUp() {
        testUserProfileDto = UserProfileDto.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .phoneNumber("1234567890")
                .roles(Set.of("ROLE_USER"))
                .build();
        
        testUserUpdateDto = UserUpdateDto.builder()
                .username("updateduser")
                .email("updated@example.com")
                .firstName("Updated")
                .lastName("User")
                .phoneNumber("0987654321")
                .build();
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void getCurrentUser_ShouldReturnCurrentUserProfile() throws Exception {
        // Arrange
        when(userService.getUserById(anyLong())).thenReturn(testUserProfileDto);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserProfileDto.getId()))
                .andExpect(jsonPath("$.username").value(testUserProfileDto.getUsername()));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAllUsers_WithAdminRole_ShouldReturnAllUsers() throws Exception {
        // Arrange
        UserProfileDto anotherUserDto = UserProfileDto.builder()
                .id(2L)
                .username("anotheruser")
                .email("another@example.com")
                .roles(Set.of("ROLE_USER"))
                .build();
        
        List<UserProfileDto> users = Arrays.asList(testUserProfileDto, anotherUserDto);
        
        when(userService.getAllUsers()).thenReturn(users);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(testUserProfileDto.getId()))
                .andExpect(jsonPath("$[1].id").value(anotherUserDto.getId()));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void getAllUsers_WithUserRole_ShouldReturnForbidden() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getUserById_WithAdminRole_ShouldReturnUser() throws Exception {
        // Arrange
        when(userService.getUserById(anyLong())).thenReturn(testUserProfileDto);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserProfileDto.getId()))
                .andExpect(jsonPath("$.username").value(testUserProfileDto.getUsername()));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void getUserById_WhenOwnProfile_ShouldReturnUser() throws Exception {
        // Arrange
        when(securityService.isCurrentUser(anyLong())).thenReturn(true);
        when(userService.getUserById(anyLong())).thenReturn(testUserProfileDto);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserProfileDto.getId()))
                .andExpect(jsonPath("$.username").value(testUserProfileDto.getUsername()));
    }

    @Test
    @WithMockUser(username = "otheruser", roles = {"USER"})
    void getUserById_WhenNotOwnProfile_ShouldReturnForbidden() throws Exception {
        // Arrange
        when(securityService.isCurrentUser(anyLong())).thenReturn(false);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getUserByUsername_WithAdminRole_ShouldReturnUser() throws Exception {
        // Arrange
        when(userService.getUserByUsername(anyString())).thenReturn(testUserProfileDto);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users/by-username/testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserProfileDto.getId()))
                .andExpect(jsonPath("$.username").value(testUserProfileDto.getUsername()));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void getUserByUsername_WhenOwnProfile_ShouldReturnUser() throws Exception {
        // Arrange
        when(securityService.isCurrentUsername(anyString())).thenReturn(true);
        when(userService.getUserByUsername(anyString())).thenReturn(testUserProfileDto);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users/by-username/testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserProfileDto.getId()))
                .andExpect(jsonPath("$.username").value(testUserProfileDto.getUsername()));
    }

    @Test
    @WithMockUser(username = "otheruser", roles = {"USER"})
    void getUserByUsername_WhenNotOwnProfile_ShouldReturnForbidden() throws Exception {
        // Arrange
        when(securityService.isCurrentUsername(anyString())).thenReturn(false);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users/by-username/testuser"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateUser_WithAdminRole_ShouldUpdateAndReturnUser() throws Exception {
        // Arrange
        when(userService.updateUser(anyLong(), any(UserUpdateDto.class))).thenReturn(testUserProfileDto);

        // Act & Assert
        mockMvc.perform(put("/api/v1/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserUpdateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserProfileDto.getId()))
                .andExpect(jsonPath("$.username").value(testUserProfileDto.getUsername()));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void updateUser_WhenOwnProfile_ShouldUpdateAndReturnUser() throws Exception {
        // Arrange
        when(securityService.isCurrentUser(anyLong())).thenReturn(true);
        when(userService.updateUser(anyLong(), any(UserUpdateDto.class))).thenReturn(testUserProfileDto);

        // Mock user principal for request
        UserPrincipal principal = UserPrincipal.builder()
                .id(1L)
                .username("testuser")
                .build();

        // Act & Assert
        mockMvc.perform(put("/api/v1/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserUpdateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserProfileDto.getId()))
                .andExpect(jsonPath("$.username").value(testUserProfileDto.getUsername()));
    }

    @Test
    @WithMockUser(username = "otheruser", roles = {"USER"})
    void updateUser_WhenNotOwnProfile_ShouldReturnForbidden() throws Exception {
        // Arrange
        when(securityService.isCurrentUser(anyLong())).thenReturn(false);

        // Act & Assert
        mockMvc.perform(put("/api/v1/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserUpdateDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteUser_WithAdminRole_ShouldDeleteAndReturnNoContent() throws Exception {
        // Arrange
        doNothing().when(userService).deleteUser(anyLong());

        // Act & Assert
        mockMvc.perform(delete("/api/v1/users/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void deleteUser_WithUserRole_ShouldReturnForbidden() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/v1/users/1"))
                .andExpect(status().isForbidden());
    }
} 