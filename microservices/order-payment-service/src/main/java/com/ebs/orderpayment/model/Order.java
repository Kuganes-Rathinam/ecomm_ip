package com.ebs.orderpayment.model;

import com.ebs.orderpayment.model.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Order document — uses EMBEDDING for order items.
 * Stores a denormalized snapshot of items at time of purchase.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("total_amount")
    private Double totalAmount;

    @Builder.Default
    @Field("status")
    private OrderStatus status = OrderStatus.PENDING;

    @Builder.Default
    @Field("items")
    private List<OrderItem> items = new ArrayList<>(); // EMBEDDED array

    @Builder.Default
    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
