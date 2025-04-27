package com.bangbang.kyc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * KYC Service Application
 * Handles Know Your Customer verification for the BangBang delivery platform
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class KycServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(KycServiceApplication.class, args);
    }
} 