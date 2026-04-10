package com.ebs.catalog.repository;

import com.ebs.catalog.model.Attribute;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AttributeRepository extends MongoRepository<Attribute, String> {
    boolean existsByAttributeName(String attributeName);
}
