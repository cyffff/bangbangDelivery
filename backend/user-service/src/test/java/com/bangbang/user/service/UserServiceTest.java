package com.bangbang.user.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.bangbang.user.dto.UserProfileDto;
import com.bangbang.user.dto.UserUpdateDto;
import com.bangbang.user.entity.Role;
import com.bangbang.user.entity.User;
import com.bangbang.user.exception.ResourceNotFoundException;
import com.bangbang.user.exception.UserAlreadyExistsException;
import com.bangbang.user.mapper.UserMapper;
import com.bangbang.user.repository.UserRepository;
import com.bangbang.user.service.impl.UserServiceImpl;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private UserProfileDto testUserProfileDto;
    private UserUpdateDto testUserUpdateDto;
    private Set<Role> roles;

    @BeforeEach
    void setUp() {
        Role userRole = new Role();
        userRole.setId(1L);
        userRole.setName("ROLE_USER");
        
        roles = new HashSet<>();
        roles.add(userRole);
        
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .phoneNumber("1234567890")
                .passwordHash("hashedPassword")
                .roles(roles)
                .build();
        
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
    void getUserById_WhenUserExists_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(userMapper.userToUserProfileDto(any(User.class))).thenReturn(testUserProfileDto);

        // Act
        UserProfileDto result = userService.getUserById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testUserProfileDto.getId(), result.getId());
        assertEquals(testUserProfileDto.getUsername(), result.getUsername());
        
        // Verify
        verify(userRepository).findById(1L);
        verify(userMapper).userToUserProfileDto(testUser);
    }

    @Test
    void getUserById_WhenUserDoesNotExist_ShouldThrowResourceNotFoundException() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(1L));
        
        // Verify
        verify(userRepository).findById(1L);
        verify(userMapper, never()).userToUserProfileDto(any(User.class));
    }

    @Test
    void getUserByUsername_WhenUserExists_ShouldReturnUser() {
        // Arrange
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(userMapper.userToUserProfileDto(any(User.class))).thenReturn(testUserProfileDto);

        // Act
        UserProfileDto result = userService.getUserByUsername("testuser");

        // Assert
        assertNotNull(result);
        assertEquals(testUserProfileDto.getUsername(), result.getUsername());
        
        // Verify
        verify(userRepository).findByUsername("testuser");
        verify(userMapper).userToUserProfileDto(testUser);
    }

    @Test
    void getUserByUsername_WhenUserDoesNotExist_ShouldThrowResourceNotFoundException() {
        // Arrange
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> userService.getUserByUsername("nonexistent"));
        
        // Verify
        verify(userRepository).findByUsername("nonexistent");
        verify(userMapper, never()).userToUserProfileDto(any(User.class));
    }

    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        // Arrange
        User anotherUser = User.builder()
                .id(2L)
                .username("anotheruser")
                .email("another@example.com")
                .roles(roles)
                .build();
        
        UserProfileDto anotherUserDto = UserProfileDto.builder()
                .id(2L)
                .username("anotheruser")
                .email("another@example.com")
                .build();
        
        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser, anotherUser));
        when(userMapper.userToUserProfileDto(testUser)).thenReturn(testUserProfileDto);
        when(userMapper.userToUserProfileDto(anotherUser)).thenReturn(anotherUserDto);

        // Act
        List<UserProfileDto> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        
        // Verify
        verify(userRepository).findAll();
        verify(userMapper, times(2)).userToUserProfileDto(any(User.class));
    }

    @Test
    void updateUser_WhenUserExists_ShouldUpdateAndReturnUser() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(userMapper.userToUserProfileDto(any(User.class))).thenReturn(testUserProfileDto);

        // Act
        UserProfileDto result = userService.updateUser(1L, testUserUpdateDto);

        // Assert
        assertNotNull(result);
        
        // Verify
        verify(userRepository).findById(1L);
        verify(userRepository).save(testUser);
        verify(userMapper).userToUserProfileDto(testUser);
    }

    @Test
    void updateUser_WhenUsernameAlreadyExists_ShouldThrowUserAlreadyExistsException() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> 
            userService.updateUser(1L, testUserUpdateDto));
        
        // Verify
        verify(userRepository).findById(1L);
        verify(userRepository).existsByUsername(testUserUpdateDto.getUsername());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUser_WhenEmailAlreadyExists_ShouldThrowUserAlreadyExistsException() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> 
            userService.updateUser(1L, testUserUpdateDto));
        
        // Verify
        verify(userRepository).findById(1L);
        verify(userRepository).existsByUsername(testUserUpdateDto.getUsername());
        verify(userRepository).existsByEmail(testUserUpdateDto.getEmail());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUser_WhenPasswordUpdate_ShouldUpdateHashedPassword() {
        // Arrange
        testUserUpdateDto.setCurrentPassword("currentPassword");
        testUserUpdateDto.setNewPassword("newPassword");
        
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(passwordEncoder.encode(anyString())).thenReturn("newHashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(userMapper.userToUserProfileDto(any(User.class))).thenReturn(testUserProfileDto);

        // Act
        UserProfileDto result = userService.updateUser(1L, testUserUpdateDto);

        // Assert
        assertNotNull(result);
        
        // Verify
        verify(passwordEncoder).matches(testUserUpdateDto.getCurrentPassword(), testUser.getPasswordHash());
        verify(passwordEncoder).encode(testUserUpdateDto.getNewPassword());
        verify(userRepository).save(testUser);
    }

    @Test
    void updateUser_WhenPasswordUpdateWithoutCurrentPassword_ShouldThrowAccessDeniedException() {
        // Arrange
        testUserUpdateDto.setCurrentPassword(null);
        testUserUpdateDto.setNewPassword("newPassword");
        
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> 
            userService.updateUser(1L, testUserUpdateDto));
        
        // Verify
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUser_WhenIncorrectCurrentPassword_ShouldThrowAccessDeniedException() {
        // Arrange
        testUserUpdateDto.setCurrentPassword("wrongPassword");
        testUserUpdateDto.setNewPassword("newPassword");
        
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> 
            userService.updateUser(1L, testUserUpdateDto));
        
        // Verify
        verify(passwordEncoder).matches(testUserUpdateDto.getCurrentPassword(), testUser.getPasswordHash());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_WhenUserExists_ShouldDeleteUser() {
        // Arrange
        when(userRepository.existsById(anyLong())).thenReturn(true);
        doNothing().when(userRepository).deleteById(anyLong());

        // Act
        userService.deleteUser(1L);

        // Verify
        verify(userRepository).existsById(1L);
        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_WhenUserDoesNotExist_ShouldThrowResourceNotFoundException() {
        // Arrange
        when(userRepository.existsById(anyLong())).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(1L));
        
        // Verify
        verify(userRepository).existsById(1L);
        verify(userRepository, never()).deleteById(anyLong());
    }
} 