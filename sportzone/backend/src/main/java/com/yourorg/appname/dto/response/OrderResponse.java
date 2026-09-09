package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long userId;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal shippingAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private String promoCode;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String shippingFirstName;
    private String shippingLastName;
    private String shippingAddress;
    private String shippingApt;
    private String shippingCity;
    private String shippingState;
    private String shippingZipCode;
    private String shippingPhone;
    private String shippingTier;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}
