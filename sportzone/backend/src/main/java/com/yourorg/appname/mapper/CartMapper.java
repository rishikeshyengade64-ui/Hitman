package com.yourorg.appname.mapper;

import com.yourorg.appname.dto.response.CartItemResponse;
import com.yourorg.appname.dto.response.CartResponse;
import com.yourorg.appname.entity.CartItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    public CartItemResponse toItemResponse(CartItem item) {
        if (item == null) return null;

        BigDecimal unitPrice = item.getUnitPrice();
        BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productTitle(item.getProduct().getTitle())
                .productSlug(item.getProduct().getSlug())
                .sku(item.getProduct().getSku())
                .categoryName(item.getProduct().getCategory() != null ? item.getProduct().getCategory().getName() : null)
                .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                .variantSize(item.getVariant() != null ? item.getVariant().getSize() : null)
                .variantColor(item.getVariant() != null ? item.getVariant().getColor() : null)
                .quantity(item.getQuantity())
                .unitPrice(unitPrice)
                .msrp(item.getProduct().getMsrp())
                .itemTotal(itemTotal)
                .imageUrl(item.getProduct().getPrimaryImageUrl())
                .build();
    }

    public CartResponse toCartResponse(List<CartItem> items) {
        List<CartItemResponse> itemResponses = items.stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList());

        int totalItems = items.stream().mapToInt(CartItem::getQuantity).sum();
        BigDecimal subtotal = itemResponses.stream()
                .map(CartItemResponse::getItemTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .items(itemResponses)
                .totalItems(totalItems)
                .subtotal(subtotal)
                .build();
    }
}
