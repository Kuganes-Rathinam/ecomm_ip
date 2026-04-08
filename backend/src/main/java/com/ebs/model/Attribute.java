package com.ebs.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "attributes")
public class Attribute {

    @Id
    private String id; // attribute_id (ObjectId)

    @NotBlank(message = "Attribute name is required")
    @Indexed(unique = true)
    @Field("attribute_name")
    private String attributeName; // e.g., "Color", "Size"

    @NotBlank(message = "Slug is required")
    @Field("slug")
    private String slug;
}
