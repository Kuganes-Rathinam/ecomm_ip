package com.ebs.orderpayment.client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Lightweight DTO representing the Cart returned from cart-service via Feign.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {
    private String id;
    private String userId;
    private List<CartItemDto> items = new ArrayList<>();
}
