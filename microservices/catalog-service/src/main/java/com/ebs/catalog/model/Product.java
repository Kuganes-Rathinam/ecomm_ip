package com.ebs.catalog.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    @NotBlank(message = "Category ID is required")
    @Field("category_id")
    private String categoryId;

    @NotBlank(message = "Product name is required")
    @Field("product_name")
    private String productName;

    @NotBlank(message = "Slug is required")
    @Indexed(unique = true)
    @Field("slug")
    private String slug;

    @Field("description")
    private String description;

    @Field("product_type")
    private String productType;

    @NotNull(message = "Original price is required")
    @Min(value = 0, message = "Price cannot be negative")
    @Field("original_price")
    private Double originalPrice;

    @Field("sale_price")
    private Double salePrice;

    @Min(value = 0, message = "Quantity cannot be negative")
    @Field("quantity")
    private Integer quantity;

    @Field("ratings")
    private Double ratings;

    @Field("status")
    private String status;

    @Field("image_url")
    private String imageUrl;
}
