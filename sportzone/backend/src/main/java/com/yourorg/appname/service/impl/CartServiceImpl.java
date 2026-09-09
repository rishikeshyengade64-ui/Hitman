package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.AddToCartRequest;
import com.yourorg.appname.dto.request.UpdateCartItemRequest;
import com.yourorg.appname.dto.response.CartResponse;
import com.yourorg.appname.entity.CartItem;
import com.yourorg.appname.entity.Product;
import com.yourorg.appname.entity.ProductVariant;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.CartMapper;
import com.yourorg.appname.repository.CartItemRepository;
import com.yourorg.appname.repository.ProductRepository;
import com.yourorg.appname.repository.ProductVariantRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CartMapper cartMapper;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(String userEmail) {
        User user = getUser(userEmail);
        List<CartItem> items = cartItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return cartMapper.toCartResponse(items);
    }

    @Override
    @Transactional
    public CartResponse addToCart(String userEmail, AddToCartRequest request) {
        User user = getUser(userEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = productVariantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variant not found with id: " + request.getVariantId()));
        }

        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductIdAndVariantId(
                user.getId(), product.getId(), variant != null ? variant.getId() : null
        );

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .unitPrice(variant != null && variant.getPriceOverride() != null ? variant.getPriceOverride() : product.getPrice())
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(userEmail);
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(String userEmail, Long itemId, UpdateCartItemRequest request) {
        User user = getUser(userEmail);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return getCart(userEmail);
    }

    @Override
    @Transactional
    public CartResponse removeCartItem(String userEmail, Long itemId) {
        User user = getUser(userEmail);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        cartItemRepository.delete(item);
        return getCart(userEmail);
    }

    @Override
    @Transactional
    public void clearCart(String userEmail) {
        User user = getUser(userEmail);
        cartItemRepository.deleteByUserId(user.getId());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
