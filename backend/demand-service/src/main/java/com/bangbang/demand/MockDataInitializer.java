package com.bangbang.demand;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Initializes mock data for the demand service that matches the original mock data
 * that was previously used in the HomePage component
 */
@Component
public class MockDataInitializer implements ApplicationRunner {

    private final DemandServiceApplication.DemandController demandController;

    public MockDataInitializer(DemandServiceApplication.DemandController demandController) {
        this.demandController = demandController;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Clear existing demands
        demandController.getAllDemands().clear();
        
        // Add new mock data based on the original Home Page mock data
        addMockTasks();
        
        System.out.println("Initialized mock demand data to match original HomePage display");
        
        // Check what's in the database after adding
        List<Map<String, Object>> demands = demandController.getAllDemands();
        System.out.println("Current demands in database: " + demands.size());
        for (Map<String, Object> demand : demands) {
            System.out.println("Demand: " + demand.get("title") + " | Date: " + demand.get("createdAt") + " | ID: " + demand.get("id"));
        }
    }
    
    private void addMockTasks() {
        // Add Vitamins and Supplements from San Francisco
        Map<String, Object> demand1 = new HashMap<>();
        demand1.put("title", "Vitamins and Supplements from San Francisco");
        demand1.put("description", "Need vitamins and supplements delivered from San Francisco to Shanghai");
        demand1.put("itemType", "Medicine");
        demand1.put("originCity", "San Francisco");
        demand1.put("originCountry", "USA");
        demand1.put("destinationCity", "Shanghai");
        demand1.put("destinationCountry", "China");
        demand1.put("weightKg", 2.5);
        demand1.put("dimensions", "25 × 15 × 10 cm");
        demand1.put("deliveryMethod", "Meet in person");
        demand1.put("createdAt", "2023-04-24T10:30:00Z");
        demand1.put("userId", "user123");
        demand1.put("rewardAmount", 80.0);
        demand1.put("status", "PENDING");
        
        // Add Specialty Coffee Beans from Seattle
        Map<String, Object> demand2 = new HashMap<>();
        demand2.put("title", "Specialty Coffee Beans from Seattle");
        demand2.put("description", "Need specialty coffee beans delivered from Seattle to Tokyo");
        demand2.put("itemType", "Food");
        demand2.put("originCity", "Seattle");
        demand2.put("originCountry", "USA");
        demand2.put("destinationCity", "Tokyo");
        demand2.put("destinationCountry", "Japan");
        demand2.put("weightKg", 1.8);
        demand2.put("dimensions", "20 × 15 × 8 cm");
        demand2.put("deliveryMethod", "Meet in person");
        demand2.put("createdAt", "2023-04-23T14:45:00Z");
        demand2.put("userId", "user456");
        demand2.put("rewardAmount", 50.0);
        demand2.put("status", "PENDING");
        
        // Add Apple MacBook Pro Laptop
        Map<String, Object> demand3 = new HashMap<>();
        demand3.put("title", "Apple MacBook Pro Laptop");
        demand3.put("description", "Need a MacBook Pro delivered from New York to Dubai");
        demand3.put("itemType", "Electronics");
        demand3.put("originCity", "New York");
        demand3.put("originCountry", "USA");
        demand3.put("destinationCity", "Dubai");
        demand3.put("destinationCountry", "UAE");
        demand3.put("weightKg", 3.2);
        demand3.put("dimensions", "35 × 25 × 6 cm");
        demand3.put("deliveryMethod", "Courier");
        demand3.put("createdAt", "2023-04-22T09:15:00Z");
        demand3.put("userId", "user123");
        demand3.put("rewardAmount", 150.0);
        demand3.put("status", "PENDING");
        
        // Add Designer Handbag from Paris
        Map<String, Object> demand4 = new HashMap<>();
        demand4.put("title", "Designer Handbag from Paris");
        demand4.put("description", "Need a designer handbag delivered from Paris to Beijing");
        demand4.put("itemType", "Other");
        demand4.put("originCity", "Paris");
        demand4.put("originCountry", "France");
        demand4.put("destinationCity", "Beijing");
        demand4.put("destinationCountry", "China");
        demand4.put("weightKg", 1.5);
        demand4.put("dimensions", "40 × 30 × 20 cm");
        demand4.put("deliveryMethod", "Home Delivery");
        demand4.put("createdAt", "2023-04-21T16:30:00Z");
        demand4.put("userId", "user456");
        demand4.put("rewardAmount", 120.0);
        demand4.put("status", "PENDING");
        
        // Add Business Documents Package
        Map<String, Object> demand5 = new HashMap<>();
        demand5.put("title", "Business Documents Package");
        demand5.put("description", "Need business documents delivered from London to Singapore");
        demand5.put("itemType", "Documents");
        demand5.put("originCity", "London");
        demand5.put("originCountry", "UK");
        demand5.put("destinationCity", "Singapore");
        demand5.put("destinationCountry", "Singapore");
        demand5.put("weightKg", 0.8);
        demand5.put("dimensions", "30 × 21 × 3 cm");
        demand5.put("deliveryMethod", "Meet in person");
        demand5.put("createdAt", "2023-04-20T11:00:00Z");
        demand5.put("userId", "user123");
        demand5.put("rewardAmount", 70.0);
        demand5.put("status", "PENDING");
        
        // Add Baby Formula from Australia
        Map<String, Object> demand6 = new HashMap<>();
        demand6.put("title", "Baby Formula from Australia");
        demand6.put("description", "Need baby formula delivered from Sydney to Hong Kong");
        demand6.put("itemType", "Food");
        demand6.put("originCity", "Sydney");
        demand6.put("originCountry", "Australia");
        demand6.put("destinationCity", "Hong Kong");
        demand6.put("destinationCountry", "China");
        demand6.put("weightKg", 4.0);
        demand6.put("dimensions", "45 × 35 × 25 cm");
        demand6.put("deliveryMethod", "Courier");
        demand6.put("createdAt", "2023-04-19T08:45:00Z");
        demand6.put("userId", "user456");
        demand6.put("rewardAmount", 90.0);
        demand6.put("status", "PENDING");
        
        // Create demands in order from oldest to newest to match the expected sorting
        demandController.createDemand(demand6); // April 19
        demandController.createDemand(demand5); // April 20
        demandController.createDemand(demand4); // April 21
        demandController.createDemand(demand3); // April 22
        demandController.createDemand(demand2); // April 23
        demandController.createDemand(demand1); // April 24
    }
} 