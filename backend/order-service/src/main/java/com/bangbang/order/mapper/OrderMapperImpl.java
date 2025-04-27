package com.bangbang.order.mapper;

import com.bangbang.order.dto.OrderRequest;
import com.bangbang.order.dto.OrderResponse;
import com.bangbang.order.model.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public Order orderRequestToOrder(OrderRequest orderRequest) {
        if (orderRequest == null) {
            return null;
        }

        Order order = new Order();
        order.setDemandId(orderRequest.getDemandId());
        order.setJourneyId(orderRequest.getJourneyId());
        order.setDemanderId(orderRequest.getDemanderId());
        order.setTravelerId(orderRequest.getTravelerId());
        order.setItemName(orderRequest.getItemName());
        order.setDescription(orderRequest.getDescription());
        order.setWeight(orderRequest.getWeight() != null ? orderRequest.getWeight().doubleValue() : null);
        order.setVolume(orderRequest.getVolume() != null ? orderRequest.getVolume().doubleValue() : null);
        order.setPickupLocation(orderRequest.getPickupLocation());
        order.setDeliveryLocation(orderRequest.getDeliveryLocation());
        order.setExpectedPickupDate(orderRequest.getExpectedPickupDate());
        order.setExpectedDeliveryDate(orderRequest.getExpectedDeliveryDate());
        order.setPrice(orderRequest.getPrice());
        
        return order;
    }

    @Override
    public OrderResponse orderToOrderResponse(Order order) {
        if (order == null) {
            return null;
        }

        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setId(order.getId());
        orderResponse.setDemandId(order.getDemandId());
        orderResponse.setJourneyId(order.getJourneyId());
        orderResponse.setDemanderId(order.getDemanderId());
        orderResponse.setTravelerId(order.getTravelerId());
        orderResponse.setItemName(order.getItemName());
        orderResponse.setDescription(order.getDescription());
        orderResponse.setWeight(order.getWeight() != null ? java.math.BigDecimal.valueOf(order.getWeight()) : null);
        orderResponse.setVolume(order.getVolume() != null ? java.math.BigDecimal.valueOf(order.getVolume()) : null);
        orderResponse.setPickupLocation(order.getPickupLocation());
        orderResponse.setDeliveryLocation(order.getDeliveryLocation());
        orderResponse.setExpectedPickupDate(order.getExpectedPickupDate());
        orderResponse.setExpectedDeliveryDate(order.getExpectedDeliveryDate());
        orderResponse.setActualPickupDate(order.getActualPickupDate());
        orderResponse.setActualDeliveryDate(order.getActualDeliveryDate());
        orderResponse.setPrice(order.getPrice());
        orderResponse.setStatus(order.getStatus());
        orderResponse.setCreatedAt(order.getCreatedAt());
        orderResponse.setUpdatedAt(order.getUpdatedAt());
        
        return orderResponse;
    }

    @Override
    public void updateOrderFromRequest(OrderRequest orderRequest, Order order) {
        if (orderRequest == null || order == null) {
            return;
        }
        
        order.setDemandId(orderRequest.getDemandId());
        order.setJourneyId(orderRequest.getJourneyId());
        order.setDemanderId(orderRequest.getDemanderId());
        order.setTravelerId(orderRequest.getTravelerId());
        order.setItemName(orderRequest.getItemName());
        order.setDescription(orderRequest.getDescription());
        order.setWeight(orderRequest.getWeight() != null ? orderRequest.getWeight().doubleValue() : null);
        order.setVolume(orderRequest.getVolume() != null ? orderRequest.getVolume().doubleValue() : null);
        order.setPickupLocation(orderRequest.getPickupLocation());
        order.setDeliveryLocation(orderRequest.getDeliveryLocation());
        order.setExpectedPickupDate(orderRequest.getExpectedPickupDate());
        order.setExpectedDeliveryDate(orderRequest.getExpectedDeliveryDate());
        order.setPrice(orderRequest.getPrice());
    }
} 