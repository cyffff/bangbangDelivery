package com.bangbang.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bangbang.auth.entity.User;

/**
 * Repository for User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find a user by email.
     * 
     * @param email the email to search for
     * @return an Optional containing the user if found
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find a user by username.
     * 
     * @param username the username to search for
     * @return an Optional containing the user if found
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Check if a user exists with the given email.
     * 
     * @param email the email to check
     * @return true if a user exists with the email
     */
    boolean existsByEmail(String email);
    
    /**
     * Check if a user exists with the given username.
     * 
     * @param username the username to check
     * @return true if a user exists with the username
     */
    boolean existsByUsername(String username);
    
    /**
     * Find a user by email or username.
     * 
     * @param email the email to search for
     * @param username the username to search for
     * @return an Optional containing the user if found
     */
    Optional<User> findByEmailOrUsername(String email, String username);
    
    /**
     * Find a user by username or email.
     * 
     * @param username the username to search for
     * @param email the email to search for
     * @return an Optional containing the user if found
     */
    Optional<User> findByUsernameOrEmail(String username, String email);
} 