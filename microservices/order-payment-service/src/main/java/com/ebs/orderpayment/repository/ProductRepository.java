package com.ebs.orderpayment.repository;

import com.ebs.orderpayment.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Read-only repository for the shared products collection.
 * Used by OrderService to fetch product price for order items.
 * Stock decrements are done atomically via MongoTemplate — not through this repository.
 */
public interface ProductRepository extends MongoRepository<Product, String> {
}
