package com.ebs.catalog.repository;

import com.ebs.catalog.model.Term;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TermRepository extends MongoRepository<Term, String> {
    List<Term> findByAttributeId(String attributeId);
}
