package com.ebs.orderpayment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * OpenFeign client for cart-service.
 * Used by OrderService to:
 *   1. Fetch the user's cart items before placing an order.
 *   2. Clear the cart after a successful order.
 *
 * The name "CART-SERVICE" must match spring.application.name in cart-service.
 */
@FeignClient(name = "CART-SERVICE")
public interface CartServiceClient {

    @GetMapping("/api/carts/{userId}")
    CartDto getCart(@PathVariable("userId") String userId);

    @DeleteMapping("/api/carts/{userId}")
    ResponseEntity<Void> clearCart(@PathVariable("userId") String userId);
}
