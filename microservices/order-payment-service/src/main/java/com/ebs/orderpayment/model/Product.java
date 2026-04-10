package com.ebs.orderpayment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Local read model for Product — used ONLY by OrderService for atomic stock
 * decrements via MongoTemplate. The authoritative write model lives in
 * catalog-service. Since both services share the same MongoDB instance, this
 * read-only model works correctly without synchronization overhead.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    @Field("product_name")
    private String productName;

    @Field("original_price")
    private Double originalPrice;

    @Field("sale_price")
    private Double salePrice;

    @Field("quantity")
    private Integer quantity;

    @Field("status")
    private String status;
}
