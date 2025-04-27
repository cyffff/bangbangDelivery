package com.bangbang.demand;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Demand Service Application
 * Manages user demands for shipment and transportation
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class DemandServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemandServiceApplication.class, args);
    }
} 