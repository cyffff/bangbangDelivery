package com.bangbang.common.core.model;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Base entity class with common fields for all entities
 */
@Data
public class BaseEntity implements Serializable {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 