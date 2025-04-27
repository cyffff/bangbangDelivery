package com.bangbang.journey;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Journey Service Application
 * Manages traveler journeys and routes for the BangBang delivery platform
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class JourneyServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(JourneyServiceApplication.class, args);
    }
} 