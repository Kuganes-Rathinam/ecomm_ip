package com.ebs.cart.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded sub-document inside Cart.items array.
 * Not a @Document — stored inside Cart collection.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    private String productId;
    private Integer quantity;
}
