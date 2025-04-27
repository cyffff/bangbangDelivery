package com.bangbang.order.repository;

import com.bangbang.order.model.Order;
import com.bangbang.order.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByDemanderId(Long demanderId);
    
    List<Order> findByTravelerId(Long travelerId);
    
    List<Order> findByStatus(OrderStatus status);
    
    List<Order> findByDemanderIdAndStatus(Long demanderId, OrderStatus status);
    
    List<Order> findByTravelerIdAndStatus(Long travelerId, OrderStatus status);
    
    List<Order> findByDemandId(Long demandId);
    
    List<Order> findByJourneyId(Long journeyId);
    
    List<Order> findByMatchId(Long matchId);
} 