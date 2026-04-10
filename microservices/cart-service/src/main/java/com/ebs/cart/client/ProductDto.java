package com.ebs.cart.client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight DTO representing the product data returned by catalog-service
 * via Feign. Only fields needed for cart validation are included.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private String id;
    private String productName;
    private Double originalPrice;
    private Double salePrice;
    private Integer quantity;
    private String status;
}
