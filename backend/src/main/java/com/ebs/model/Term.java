package com.ebs.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "terms")
public class Term {

    @Id
    private String id; // term_id (ObjectId)

    @NotBlank(message = "Term name is required")
    @Field("term_name")
    private String termName; // e.g., "Red", "XL"

    @NotBlank(message = "Slug is required")
    @Field("slug")
    private String slug;

    @NotBlank(message = "Attribute ID is required")
    @Field("attribute_id")
    private String attributeId; // Reference to Attribute._id

    @Field("price")
    private Double price; // Optional price modifier for this term
}
