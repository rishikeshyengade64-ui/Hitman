package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.ProductDetailResponse;
import com.yourorg.appname.dto.response.ProductResponse;
import com.yourorg.appname.entity.Product;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.ProductMapper;
import com.yourorg.appname.repository.ProductRepository;
import com.yourorg.appname.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(String category, String brand, BigDecimal minPrice, BigDecimal maxPrice, Boolean inStock, String query, Pageable pageable) {
        Page<Product> products = productRepository.filterProducts(category, brand, minPrice, maxPrice, inStock, query, pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toDetailResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return productMapper.toDetailResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue().stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getNewArrivals() {
        return productRepository.findByIsNewArrivalTrue().stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }
}
