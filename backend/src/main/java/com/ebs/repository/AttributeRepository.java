package com.ebs.repository;

import com.ebs.model.Attribute;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AttributeRepository extends MongoRepository<Attribute, String> {
    Optional<Attribute> findByAttributeName(String attributeName);
    Optional<Attribute> findBySlug(String slug);
    boolean existsByAttributeName(String attributeName);
}
