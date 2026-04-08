package com.ebs.repository;

import com.ebs.model.Term;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TermRepository extends MongoRepository<Term, String> {
    // Get all terms belonging to an attribute (for product variation dropdowns)
    List<Term> findByAttributeId(String attributeId);
    Optional<Term> findBySlug(String slug);
}
