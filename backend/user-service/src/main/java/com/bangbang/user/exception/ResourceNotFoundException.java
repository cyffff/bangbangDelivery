package com.bangbang.user.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a requested resource is not found.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;
    
    private String resourceName;
    private String fieldName;
    private Object fieldValue;
    
    /**
     * Create a new ResourceNotFoundException.
     *
     * @param resourceName the name of the resource
     * @param fieldName the name of the field
     * @param fieldValue the value of the field
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
    
    /**
     * Get the resource name.
     *
     * @return the resource name
     */
    public String getResourceName() {
        return resourceName;
    }
    
    /**
     * Get the field name.
     *
     * @return the field name
     */
    public String getFieldName() {
        return fieldName;
    }
    
    /**
     * Get the field value.
     *
     * @return the field value
     */
    public Object getFieldValue() {
        return fieldValue;
    }
} 