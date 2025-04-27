package com.bangbang.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

/**
 * Configuration for API Gateway routes.
 * This class defines the routing rules for forwarding requests to microservices.
 */
@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // User Service Routes
                .route("user-service", r -> r
                        .path("/api/v1/users/**")
                        .uri("lb://user-service"))
                .route("user-auth", r -> r
                        .path("/api/v1/auth/**")
                        .uri("lb://user-service"))
                
                // Demand Service Routes
                .route("demand-service", r -> r
                        .path("/api/v1/demands/**")
                        .uri("lb://demand-service"))
                
                // Journey Service Routes
                .route("journey-service", r -> r
                        .path("/api/v1/journeys/**")
                        .uri("lb://journey-service"))
                
                // Matching Service Routes
                .route("matching-service", r -> r
                        .path("/api/v1/matching/**")
                        .uri("lb://matching-service"))
                
                // Order Service Routes
                .route("order-service", r -> r
                        .path("/api/v1/orders/**")
                        .uri("lb://order-service"))
                
                // Payment Service Routes
                .route("payment-service", r -> r
                        .path("/api/v1/payments/**")
                        .uri("lb://payment-service"))
                
                // Messaging Service Routes
                .route("messaging-service", r -> r
                        .path("/api/v1/messages/**")
                        .uri("lb://messaging-service"))
                .route("messaging-ws", r -> r
                        .path("/ws/**")
                        .uri("lb://messaging-service"))
                
                // KYC Service Routes
                .route("kyc-service", r -> r
                        .path("/api/v1/kyc/**")
                        .uri("lb://kyc-service"))
                
                // Review Service Routes
                .route("review-service", r -> r
                        .path("/api/v1/reviews/**")
                        .uri("lb://review-service"))
                
                // Notification Service Routes
                .route("notification-service", r -> r
                        .path("/api/v1/notifications/**")
                        .uri("lb://notification-service"))
                
                // Add fallback for undefined routes
                .route("fallback", r -> r
                        .path("/**")
                        .filters(f -> f.setResponseHeader("X-Gateway-Error", "Invalid Route"))
                        .uri("lb://user-service/error"))
                .build();
    }
} 