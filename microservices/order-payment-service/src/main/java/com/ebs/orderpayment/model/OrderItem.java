package com.ebs.orderpayment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded sub-document inside Order.items array.
 * Stores a snapshot of price at time of purchase (denormalized).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String productId;
    private Integer quantity;
    private Double price; // Price snapshot at purchase time
}
