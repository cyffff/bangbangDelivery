package com.bangbang.order.model;

public enum OrderStatus {
    CREATED,        // Order is initially created
    CONFIRMED,      // Order is confirmed by both parties
    PAID,           // Payment has been made
    PICKED_UP,      // Item has been picked up by traveler
    IN_TRANSIT,     // Item is currently in transit
    ARRIVED,        // Item has arrived at destination
    DELIVERED,      // Item has been delivered to demander
    COMPLETED,      // Order is successfully completed
    CANCELLED,      // Order has been cancelled
    DISPUTED        // There is a dispute with the order
} 