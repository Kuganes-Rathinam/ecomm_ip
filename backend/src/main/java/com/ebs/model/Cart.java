package com.ebs.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.List;

/**
 * Cart document — uses EMBEDDING for items array.
 * items are stored directly inside this document (no foreign collection).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "carts")
public class Cart {

    @Id
    private String id; // cart_id (ObjectId)

    @Field("user_id")
    private String userId; // Reference to User._id

    @Builder.Default
    @Field("items")
    private List<CartItem> items = new ArrayList<>(); // EMBEDDED array
}
