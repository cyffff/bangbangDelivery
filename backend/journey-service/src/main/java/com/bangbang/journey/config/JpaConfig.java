package com.bangbang.journey.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA Configuration class.
 * Enables JPA auditing for automatic handling of createdAt and updatedAt fields.
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
} 