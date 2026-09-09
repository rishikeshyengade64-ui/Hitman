package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.AddToCartRequest;
import com.yourorg.appname.dto.request.UpdateCartItemRequest;
import com.yourorg.appname.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart(String userEmail);
    CartResponse addToCart(String userEmail, AddToCartRequest request);
    CartResponse updateCartItem(String userEmail, Long itemId, UpdateCartItemRequest request);
    CartResponse removeCartItem(String userEmail, Long itemId);
    void clearCart(String userEmail);
}
