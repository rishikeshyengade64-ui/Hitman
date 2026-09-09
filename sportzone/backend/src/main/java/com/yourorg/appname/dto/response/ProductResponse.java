package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String title;
    private String slug;
    private String sku;
    private String description;
    private BigDecimal price;
    private BigDecimal msrp;
    private Integer discountPercentage;
    private String brand;
    private String categorySlug;
    private String categoryName;
    private Boolean inStock;
    private Integer stockQuantity;
    private BigDecimal rating;
    private Integer reviewCount;
    private Boolean isFeatured;
    private Boolean isNewArrival;
    private String primaryImageUrl;
}
