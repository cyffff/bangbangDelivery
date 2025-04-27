package com.bangbang.order.service;

import com.bangbang.order.dto.OrderRequest;
import com.bangbang.order.dto.OrderResponse;
import com.bangbang.order.model.OrderStatus;

import java.util.List;

public interface OrderService {
    
    OrderResponse createOrder(OrderRequest orderRequest);
    
    OrderResponse getOrderById(Long id);
    
    List<OrderResponse> getOrdersByDemanderId(Long demanderId);
    
    List<OrderResponse> getOrdersByTravelerId(Long travelerId);
    
    List<OrderResponse> getOrdersByStatus(OrderStatus status);
    
    List<OrderResponse> getOrdersByDemanderIdAndStatus(Long demanderId, OrderStatus status);
    
    List<OrderResponse> getOrdersByTravelerIdAndStatus(Long travelerId, OrderStatus status);
    
    OrderResponse updateOrderStatus(Long id, OrderStatus status);
    
    OrderResponse updateOrder(Long id, OrderRequest orderRequest);
    
    void deleteOrder(Long id);
    
    List<OrderResponse> getOrdersByDemandId(Long demandId);
    
    List<OrderResponse> getOrdersByJourneyId(Long journeyId);
} 