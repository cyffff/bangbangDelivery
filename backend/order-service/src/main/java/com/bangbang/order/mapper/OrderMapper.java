package com.bangbang.order.mapper;

import com.bangbang.order.dto.OrderRequest;
import com.bangbang.order.dto.OrderResponse;
import com.bangbang.order.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "actualPickupDate", ignore = true)
    @Mapping(target = "actualDeliveryDate", ignore = true)
    Order orderRequestToOrder(OrderRequest orderRequest);
    
    OrderResponse orderToOrderResponse(Order order);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateOrderFromRequest(OrderRequest orderRequest, @MappingTarget Order order);
} 