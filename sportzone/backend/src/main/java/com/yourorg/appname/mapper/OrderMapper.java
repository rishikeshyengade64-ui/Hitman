package com.yourorg.appname.mapper;

import com.yourorg.appname.dto.response.OrderItemResponse;
import com.yourorg.appname.dto.response.OrderResponse;
import com.yourorg.appname.entity.Order;
import com.yourorg.appname.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderItemResponse toItemResponse(OrderItem item) {
        if (item == null) return null;
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productTitle(item.getProductTitle())
                .variantSize(item.getVariantSize())
                .variantColor(item.getVariantColor())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .imageUrl(item.getImageUrl())
                .build();
    }

    public OrderResponse toResponse(Order order) {
        if (order == null) return null;
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser().getId())
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .shippingAmount(order.getShippingAmount())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .promoCode(order.getPromoCode())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .shippingFirstName(order.getShippingFirstName())
                .shippingLastName(order.getShippingLastName())
                .shippingAddress(order.getShippingAddress())
                .shippingApt(order.getShippingApt())
                .shippingCity(order.getShippingCity())
                .shippingState(order.getShippingState())
                .shippingZipCode(order.getShippingZipCode())
                .shippingPhone(order.getShippingPhone())
                .shippingTier(order.getShippingTier())
                .createdAt(order.getCreatedAt())
                .items(order.getItems() != null ? order.getItems().stream()
                        .map(this::toItemResponse)
                        .collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }
}
