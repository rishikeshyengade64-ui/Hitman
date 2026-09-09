package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
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
    private Integer weightGrams;
    private String midsoleTech;
    private String propulsionUnit;
    private BigDecimal dropHeightMm;
    private String primaryImageUrl;
    private List<ImageDto> images;
    private List<VariantDto> variants;
    private List<ReviewResponse> reviews;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageDto {
        private Long id;
        private String imageUrl;
        private String angleLabel;
        private Integer displayOrder;
        private Boolean isPrimary;
        private String altText;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantDto {
        private Long id;
        private String size;
        private String color;
        private Integer stockQuantity;
        private String sku;
        private BigDecimal priceOverride;
    }
}
