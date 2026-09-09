package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.CreateOrderRequest;
import com.yourorg.appname.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(String userEmail, CreateOrderRequest request);
    List<OrderResponse> getUserOrders(String userEmail);
    OrderResponse getOrderByOrderNumber(String userEmail, String orderNumber);
}
