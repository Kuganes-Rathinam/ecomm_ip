package com.ebs.catalog.model;

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
    private String id;

    @NotBlank(message = "Term name is required")
    @Field("term_name")
    private String termName;

    @NotBlank(message = "Slug is required")
    @Field("slug")
    private String slug;

    @NotBlank(message = "Attribute ID is required")
    @Field("attribute_id")
    private String attributeId;

    @Field("price")
    private Double price;
}
