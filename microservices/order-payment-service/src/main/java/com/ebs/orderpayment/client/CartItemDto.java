package com.ebs.orderpayment.client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight DTO for a single cart item, embedded in CartDto.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    private String productId;
    private Integer quantity;
}
