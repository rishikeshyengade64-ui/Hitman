package com.yourorg.appname.repository;

import com.yourorg.appname.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    Optional<Product> findBySku(String sku);

    List<Product> findByIsFeaturedTrue();

    List<Product> findByIsNewArrivalTrue();

    List<Product> findByCategorySlug(String categorySlug);

    @Query("SELECT p FROM Product p WHERE " +
           "(:categorySlug IS NULL OR LOWER(p.category.slug) = LOWER(:categorySlug)) AND " +
           "(:brand IS NULL OR LOWER(p.brand) = LOWER(:brand)) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:inStock IS NULL OR p.inStock = :inStock) AND " +
           "(:query IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           " OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Product> filterProducts(
            @Param("categorySlug") String categorySlug,
            @Param("brand") String brand,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("inStock") Boolean inStock,
            @Param("query") String query,
            Pageable pageable
    );
}
