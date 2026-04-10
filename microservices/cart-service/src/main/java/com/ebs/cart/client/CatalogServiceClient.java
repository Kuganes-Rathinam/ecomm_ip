package com.ebs.cart.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * OpenFeign client for catalog-service.
 * Used by CartService to validate that a product exists before adding to cart.
 * The name "CATALOG-SERVICE" must match the spring.application.name in catalog-service.
 */
@FeignClient(name = "CATALOG-SERVICE")
public interface CatalogServiceClient {

    @GetMapping("/api/products/{id}")
    ResponseEntity<ProductDto> getProductById(@PathVariable("id") String id);
}
