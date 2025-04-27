package com.bangbang.user.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.bangbang.user.constant.SecurityConstants;
import com.bangbang.user.entity.Role;
import com.bangbang.user.entity.User;
import com.bangbang.user.repository.RoleRepository;
import com.bangbang.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        initRoles();
        initAdminUser();
    }

    private void initRoles() {
        if (roleRepository.count() == 0) {
            log.info("Initializing default roles");
            
            Role roleUser = new Role();
            roleUser.setName(SecurityConstants.ROLE_USER);
            roleUser.setDescription("Regular user role");
            roleRepository.save(roleUser);
            
            Role roleAdmin = new Role();
            roleAdmin.setName(SecurityConstants.ROLE_ADMIN);
            roleAdmin.setDescription("Administrator role");
            roleRepository.save(roleAdmin);
            
            Role roleDeliverer = new Role();
            roleDeliverer.setName(SecurityConstants.ROLE_DELIVERER);
            roleDeliverer.setDescription("Deliverer role");
            roleRepository.save(roleDeliverer);
            
            log.info("Default roles initialized");
        }
    }

    private void initAdminUser() {
        if (!userRepository.existsByUsername(SecurityConstants.DEFAULT_ADMIN_USERNAME)) {
            log.info("Initializing admin user");
            
            Role adminRole = roleRepository.findByName(SecurityConstants.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));
            
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);
            
            User adminUser = User.builder()
                    .username(SecurityConstants.DEFAULT_ADMIN_USERNAME)
                    .email(SecurityConstants.DEFAULT_ADMIN_EMAIL)
                    .passwordHash(passwordEncoder.encode(SecurityConstants.DEFAULT_ADMIN_PASSWORD))
                    .firstName("Admin")
                    .lastName("User")
                    .roles(adminRoles)
                    .build();
            
            userRepository.save(adminUser);
            log.info("Admin user initialized");
        }
    }
} 