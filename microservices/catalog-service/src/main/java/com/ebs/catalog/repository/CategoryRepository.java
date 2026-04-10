package com.ebs.catalog.repository;

import com.ebs.catalog.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {
    boolean existsByCategoryName(String categoryName);
}
