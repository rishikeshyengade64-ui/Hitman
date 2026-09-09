package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.ProductDetailResponse;
import com.yourorg.appname.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    Page<ProductResponse> getProducts(String category, String brand, BigDecimal minPrice, BigDecimal maxPrice, Boolean inStock, String query, Pageable pageable);
    ProductDetailResponse getProductById(Long id);
    ProductDetailResponse getProductBySlug(String slug);
    List<ProductResponse> getFeaturedProducts();
    List<ProductResponse> getNewArrivals();
}
