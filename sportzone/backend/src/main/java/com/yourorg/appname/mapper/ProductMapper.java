package com.yourorg.appname.mapper;

import com.yourorg.appname.dto.response.ProductDetailResponse;
import com.yourorg.appname.dto.response.ProductResponse;
import com.yourorg.appname.dto.response.ReviewResponse;
import com.yourorg.appname.entity.Product;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        if (product == null) return null;
        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .slug(product.getSlug())
                .sku(product.getSku())
                .description(product.getDescription())
                .price(product.getPrice())
                .msrp(product.getMsrp())
                .discountPercentage(product.getDiscountPercentage())
                .brand(product.getBrand())
                .categorySlug(product.getCategory() != null ? product.getCategory().getSlug() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .inStock(product.getInStock())
                .stockQuantity(product.getStockQuantity())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .isFeatured(product.getIsFeatured())
                .isNewArrival(product.getIsNewArrival())
                .primaryImageUrl(product.getPrimaryImageUrl())
                .build();
    }

    public ProductDetailResponse toDetailResponse(Product product) {
        if (product == null) return null;

        return ProductDetailResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .slug(product.getSlug())
                .sku(product.getSku())
                .description(product.getDescription())
                .price(product.getPrice())
                .msrp(product.getMsrp())
                .discountPercentage(product.getDiscountPercentage())
                .brand(product.getBrand())
                .categorySlug(product.getCategory() != null ? product.getCategory().getSlug() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .inStock(product.getInStock())
                .stockQuantity(product.getStockQuantity())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .isFeatured(product.getIsFeatured())
                .isNewArrival(product.getIsNewArrival())
                .weightGrams(product.getWeightGrams())
                .midsoleTech(product.getMidsoleTech())
                .propulsionUnit(product.getPropulsionUnit())
                .dropHeightMm(product.getDropHeightMm())
                .primaryImageUrl(product.getPrimaryImageUrl())
                .images(product.getImages() != null ? product.getImages().stream().map(img ->
                        ProductDetailResponse.ImageDto.builder()
                                .id(img.getId())
                                .imageUrl(img.getImageUrl())
                                .angleLabel(img.getAngleLabel())
                                .displayOrder(img.getDisplayOrder())
                                .isPrimary(img.getIsPrimary())
                                .altText(img.getAltText())
                                .build()
                ).collect(Collectors.toList()) : Collections.emptyList())
                .variants(product.getVariants() != null ? product.getVariants().stream().map(v ->
                        ProductDetailResponse.VariantDto.builder()
                                .id(v.getId())
                                .size(v.getSize())
                                .color(v.getColor())
                                .stockQuantity(v.getStockQuantity())
                                .sku(v.getSku())
                                .priceOverride(v.getPriceOverride())
                                .build()
                ).collect(Collectors.toList()) : Collections.emptyList())
                .reviews(product.getReviews() != null ? product.getReviews().stream().map(r ->
                        ReviewResponse.builder()
                                .id(r.getId())
                                .productId(product.getId())
                                .userId(r.getUser().getId())
                                .reviewerName(r.getUser().getFullName())
                                .rating(r.getRating())
                                .title(r.getTitle())
                                .comment(r.getComment())
                                .verifiedPurchase(r.getVerifiedPurchase())
                                .createdAt(r.getCreatedAt())
                                .build()
                ).collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }
}
