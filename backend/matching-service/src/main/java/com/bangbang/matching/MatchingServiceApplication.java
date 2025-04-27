package com.bangbang.matching;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Matching Service Application
 * Handles matching between demands and journeys for the BangBang delivery platform
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class MatchingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MatchingServiceApplication.class, args);
    }
} 