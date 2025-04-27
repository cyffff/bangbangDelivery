package com.bangbang.order.service.impl;

import com.bangbang.order.dto.OrderRequest;
import com.bangbang.order.dto.OrderResponse;
import com.bangbang.order.exception.ResourceNotFoundException;
import com.bangbang.order.mapper.OrderMapper;
import com.bangbang.order.model.Order;
import com.bangbang.order.model.OrderStatus;
import com.bangbang.order.repository.OrderRepository;
import com.bangbang.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest orderRequest) {
        log.info("Creating order for demand ID: {} and journey ID: {}", 
                orderRequest.getDemandId(), orderRequest.getJourneyId());
        
        Order order = orderMapper.orderRequestToOrder(orderRequest);
        order.setStatus(OrderStatus.CREATED);
        
        Order savedOrder = orderRepository.save(order);
        log.info("Order created with ID: {}", savedOrder.getId());
        
        return orderMapper.orderToOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        log.info("Fetching order with ID: {}", id);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        
        return orderMapper.orderToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByDemanderId(Long demanderId) {
        log.info("Fetching orders for demander ID: {}", demanderId);
        
        List<Order> orders = orderRepository.findByDemanderId(demanderId);
        
        return orders.stream()
                .map(orderMapper::orderToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByTravelerId(Long travelerId) {
        log.info("Fetching orders for traveler ID: {}", travelerId);
        
        List<Order> orders = orderRepository.findByTravelerId(travelerId);
        
        return orders.stream()
                .map(orderMapper::orderToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        log.info("Fetching orders with status: {}", status);
        
        List<Order> orders = orderRepository.findByStatus(status);
        
        return orders.stream()
                .map(orderMapper::orderToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByDemanderIdAndStatus(Long demanderId, OrderStatus status) {
        log.info("Fetching orders for demander ID: {} with status: {}", demanderId, status);
        
        List<Order> orders = orderRepository.findByDemanderIdAndStatus(demanderId, status);
        
        return orders.stream()
                .map(orderMapper::orderToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByTravelerIdAndStatus(Long travelerId, OrderStatus status) {
        log.info("Fetching orders for traveler ID: {} with status: {}", travelerId, status);
        
        List<Order> orders = orderRepository.findByTravelerIdAndStatus(travelerId, status);
        
        return orders.stream()
                .map(orderMapper::orderToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatus status) {
        log.info("Updating order with ID: {} to status: {}", id, status);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        
        order.setStatus(status);
        
        // Update actual pickup or delivery dates based on status
        if (status == OrderStatus.PICKED_UP) {
            order.setActualPickupDate(java.time.LocalDateTime.now());
        } else if (status == OrderStatus.DELIVERED) {
            order.setActualDeliveryDate(java.time.LocalDateTime.now());
        }
        
        Order updatedOrder = orderRepository.save(order);
        log.info("Order status updated successfully");
        
        return orderMapper.orderToOrderResponse(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse updateOrder(Long id, OrderRequest orderRequest) {
        log.info("Updating order with ID: {}", id);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        
        orderMapper.updateOrderFromRequest(orderRequest, order);
        
        Order updatedOrder = orderRepository.save(order);
        log.info("Order updated successfully");
        
        return orderMapper.orderToOrderResponse(updatedOrder);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        log.info("Deleting order with ID: {}", id);
        
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with ID: " + id);
        }
        
        orderRepository.deleteById(id);
        log.info("Order deleted successfully");
    }
    
    // Additional methods to handle repository queries
    
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByDemandId(Long demandId) {
        log.info("Fetching orders for demand ID: {}", demandId);
        
        List<Order> orders = orderRepository.findByDemandId(demandId);
        
        return orders.stream()
                .map(orderMapper::orderToOrderResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByJourneyId(Long journeyId) {
        log.info("Fetching orders for journey ID: {}", journeyId);
        
        List<Order> orders = orderRepository.findByJourneyId(journeyId);
        
        return orders.stream()
                .map(orderMapper::orderToOrderResponse)
                .collect(Collectors.toList());
    }
}
 