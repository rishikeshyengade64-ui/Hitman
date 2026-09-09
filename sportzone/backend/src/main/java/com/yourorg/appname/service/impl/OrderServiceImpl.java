package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.CreateOrderRequest;
import com.yourorg.appname.dto.response.OrderResponse;
import com.yourorg.appname.entity.*;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.OrderMapper;
import com.yourorg.appname.repository.CartItemRepository;
import com.yourorg.appname.repository.OrderRepository;
import com.yourorg.appname.repository.PromoCodeRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final PromoCodeRepository promoCodeRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponse createOrder(String userEmail, CreateOrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cannot create an order with an empty cart");
        }

        BigDecimal subtotal = cartItems.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate Discount
        BigDecimal discount = BigDecimal.ZERO;
        if (request.getPromoCode() != null && !request.getPromoCode().isBlank()) {
            PromoCode promo = promoCodeRepository.findByCodeIgnoreCaseAndIsActiveTrue(request.getPromoCode().trim())
                    .orElse(null);
            if (promo != null && subtotal.compareTo(promo.getMinOrderAmount()) >= 0) {
                if (promo.getDiscountPercent() > 0) {
                    discount = subtotal.multiply(BigDecimal.valueOf(promo.getDiscountPercent()))
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                } else if (promo.getDiscountAmount() != null) {
                    discount = promo.getDiscountAmount();
                }
            }
        }

        // Calculate Shipping
        BigDecimal shipping = BigDecimal.ZERO;
        boolean isOvernight = "OVERNIGHT".equalsIgnoreCase(request.getShippingTier()) ||
                              "APEX_OVERNIGHT".equalsIgnoreCase(request.getShippingTier());
        if (isOvernight) {
            shipping = new BigDecimal("14.99");
        } else {
            // Free standard shipping if over $99, else $9.99
            if (subtotal.compareTo(new BigDecimal("99.00")) < 0) {
                shipping = new BigDecimal("9.99");
            }
        }

        // Estimated Tax (6.5% on taxable amount)
        BigDecimal taxableAmount = subtotal.subtract(discount).max(BigDecimal.ZERO);
        BigDecimal tax = taxableAmount.multiply(new BigDecimal("0.065")).setScale(2, RoundingMode.HALF_UP);

        BigDecimal total = taxableAmount.add(shipping).add(tax);

        String orderNumber = "SZ-" + System.currentTimeMillis() / 1000 + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .subtotal(subtotal)
                .discountAmount(discount)
                .shippingAmount(shipping)
                .taxAmount(tax)
                .totalAmount(total)
                .promoCode(request.getPromoCode())
                .status("CONFIRMED")
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD")
                .paymentStatus("PAID")
                .shippingFirstName(request.getShippingFirstName())
                .shippingLastName(request.getShippingLastName())
                .shippingAddress(request.getShippingAddress())
                .shippingApt(request.getShippingApt())
                .shippingCity(request.getShippingCity())
                .shippingState(request.getShippingState())
                .shippingZipCode(request.getShippingZipCode())
                .shippingPhone(request.getShippingPhone())
                .shippingTier(request.getShippingTier() != null ? request.getShippingTier() : "EXPRESS_STANDARD")
                .createdAt(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();

        for (CartItem ci : cartItems) {
            BigDecimal itemTotal = ci.getUnitPrice().multiply(BigDecimal.valueOf(ci.getQuantity()));
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(ci.getProduct())
                    .productTitle(ci.getProduct().getTitle())
                    .variantSize(ci.getVariant() != null ? ci.getVariant().getSize() : null)
                    .variantColor(ci.getVariant() != null ? ci.getVariant().getColor() : null)
                    .quantity(ci.getQuantity())
                    .unitPrice(ci.getUnitPrice())
                    .totalPrice(itemTotal)
                    .imageUrl(ci.getProduct().getPrimaryImageUrl())
                    .build();
            order.getItems().add(item);
        }

        order = orderRepository.save(order);

        // Clear cart
        cartItemRepository.deleteByUserId(user.getId());

        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String userEmail, String orderNumber) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to order");
        }

        return orderMapper.toResponse(order);
    }
}
