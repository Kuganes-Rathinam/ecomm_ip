package com.ebs.catalog.repository;

import com.ebs.catalog.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByStatus(String status);
    Optional<Product> findBySlug(String slug);
    List<Product> findByCategoryId(String categoryId);
    List<Product> findByProductNameContainingIgnoreCase(String keyword);
    boolean existsBySlug(String slug);
}
