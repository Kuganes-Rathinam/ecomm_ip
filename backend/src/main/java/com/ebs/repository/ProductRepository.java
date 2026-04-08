package com.ebs.repository;

import com.ebs.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    // SEO-friendly product lookup by slug (unique index)
    Optional<Product> findBySlug(String slug);

    // Catalog page: list products by category
    List<Product> findByCategoryId(String categoryId);

    // Filter by status (e.g., "active")
    List<Product> findByStatus(String status);

    // Full-text search by product name (partial, case-insensitive handled at service level)
    List<Product> findByProductNameContainingIgnoreCase(String keyword);

    boolean existsBySlug(String slug);
}
