package com.bangbang.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bangbang.auth.entity.Role;

/**
 * Repository for Role entity.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    /**
     * Find a role by name.
     * 
     * @param name the role name
     * @return an Optional containing the role if found
     */
    Optional<Role> findByName(String name);
} 