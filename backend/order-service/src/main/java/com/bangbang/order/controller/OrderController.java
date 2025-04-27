package com.bangbang.order.controller;

import com.bangbang.order.dto.OrderRequest;
import com.bangbang.order.dto.OrderResponse;
import com.bangbang.order.model.OrderStatus;
import com.bangbang.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        log.info("Received request to create order");
        OrderResponse createdOrder = orderService.createOrder(orderRequest);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        log.info("Received request to get order with ID: {}", id);
        OrderResponse orderResponse = orderService.getOrderById(id);
        return ResponseEntity.ok(orderResponse);
    }
    
    @GetMapping("/demander/{demanderId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByDemanderId(@PathVariable Long demanderId) {
        log.info("Received request to get orders for demander ID: {}", demanderId);
        List<OrderResponse> orders = orderService.getOrdersByDemanderId(demanderId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/traveler/{travelerId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByTravelerId(@PathVariable Long travelerId) {
        log.info("Received request to get orders for traveler ID: {}", travelerId);
        List<OrderResponse> orders = orderService.getOrdersByTravelerId(travelerId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(@PathVariable OrderStatus status) {
        log.info("Received request to get orders with status: {}", status);
        List<OrderResponse> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/demander/{demanderId}/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByDemanderIdAndStatus(
            @PathVariable Long demanderId, 
            @PathVariable OrderStatus status) {
        log.info("Received request to get orders for demander ID: {} with status: {}", demanderId, status);
        List<OrderResponse> orders = orderService.getOrdersByDemanderIdAndStatus(demanderId, status);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/traveler/{travelerId}/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByTravelerIdAndStatus(
            @PathVariable Long travelerId, 
            @PathVariable OrderStatus status) {
        log.info("Received request to get orders for traveler ID: {} with status: {}", travelerId, status);
        List<OrderResponse> orders = orderService.getOrdersByTravelerIdAndStatus(travelerId, status);
        return ResponseEntity.ok(orders);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id, 
            @RequestParam OrderStatus status) {
        log.info("Received request to update order ID: {} to status: {}", id, status);
        OrderResponse updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        log.info("Received request to delete order with ID: {}", id);
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
    
    // Additional endpoints
    
    @GetMapping("/demand/{demandId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByDemandId(@PathVariable Long demandId) {
        log.info("Received request to get orders for demand ID: {}", demandId);
        List<OrderResponse> orders = orderService.getOrdersByDemandId(demandId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/journey/{journeyId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByJourneyId(@PathVariable Long journeyId) {
        log.info("Received request to get orders for journey ID: {}", journeyId);
        List<OrderResponse> orders = orderService.getOrdersByJourneyId(journeyId);
        return ResponseEntity.ok(orders);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody OrderRequest orderRequest) {
        log.info("Received request to update order with ID: {}", id);
        OrderResponse updatedOrder = orderService.updateOrder(id, orderRequest);
        return ResponseEntity.ok(updatedOrder);
    }
} 