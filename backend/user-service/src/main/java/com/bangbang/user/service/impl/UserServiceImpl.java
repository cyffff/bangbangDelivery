package com.bangbang.user.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.bangbang.user.dto.UserProfileDto;
import com.bangbang.user.dto.UserUpdateDto;
import com.bangbang.user.entity.User;
import com.bangbang.user.exception.ResourceNotFoundException;
import com.bangbang.user.exception.UserAlreadyExistsException;
import com.bangbang.user.mapper.UserMapper;
import com.bangbang.user.repository.UserRepository;
import com.bangbang.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.userToUserProfileDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return userMapper.userToUserProfileDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::userToUserProfileDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserProfileDto updateUser(Long id, UserUpdateDto userUpdateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        // Only update fields that are not null or empty
        if (StringUtils.hasText(userUpdateDto.getUsername()) && !userUpdateDto.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(userUpdateDto.getUsername())) {
                throw new UserAlreadyExistsException("Username already exists");
            }
            user.setUsername(userUpdateDto.getUsername());
        }
        
        if (StringUtils.hasText(userUpdateDto.getEmail()) && !userUpdateDto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userUpdateDto.getEmail())) {
                throw new UserAlreadyExistsException("Email already exists");
            }
            user.setEmail(userUpdateDto.getEmail());
        }
        
        if (StringUtils.hasText(userUpdateDto.getFirstName())) {
            user.setFirstName(userUpdateDto.getFirstName());
        }
        
        if (StringUtils.hasText(userUpdateDto.getLastName())) {
            user.setLastName(userUpdateDto.getLastName());
        }
        
        if (StringUtils.hasText(userUpdateDto.getPhoneNumber())) {
            user.setPhoneNumber(userUpdateDto.getPhoneNumber());
        }
        
        // Password update requires current password verification
        if (StringUtils.hasText(userUpdateDto.getNewPassword())) {
            if (!StringUtils.hasText(userUpdateDto.getCurrentPassword())) {
                throw new AccessDeniedException("Current password is required to update password");
            }
            
            if (!passwordEncoder.matches(userUpdateDto.getCurrentPassword(), user.getPasswordHash())) {
                throw new AccessDeniedException("Current password is incorrect");
            }
            
            user.setPasswordHash(passwordEncoder.encode(userUpdateDto.getNewPassword()));
        }
        
        User updatedUser = userRepository.save(user);
        return userMapper.userToUserProfileDto(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
        log.info("User with id {} deleted", id);
    }
} 