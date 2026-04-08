package com.ebs.service;

import com.ebs.model.Attribute;
import com.ebs.model.Category;
import com.ebs.model.Product;
import com.ebs.model.Term;
import com.ebs.repository.AttributeRepository;
import com.ebs.repository.CategoryRepository;
import com.ebs.repository.ProductRepository;
import com.ebs.repository.TermRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttributeRepository attributeRepository;
    private final TermRepository termRepository;

    // ── Products ─────────────────────────────────────────────
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getActiveProducts() {
        return productRepository.findByStatus("active");
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public Optional<Product> getProductBySlug(String slug) {
        return productRepository.findBySlug(slug);
    }

    public List<Product> getProductsByCategory(String categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByProductNameContainingIgnoreCase(keyword);
    }

    public Product createProduct(Product product) {
        if (productRepository.existsBySlug(product.getSlug())) {
            throw new RuntimeException("Slug already exists: " + product.getSlug());
        }
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product updatedProduct) {
        return productRepository.findById(id).map(existing -> {
            existing.setProductName(updatedProduct.getProductName());
            existing.setDescription(updatedProduct.getDescription());
            existing.setOriginalPrice(updatedProduct.getOriginalPrice());
            existing.setSalePrice(updatedProduct.getSalePrice());
            existing.setQuantity(updatedProduct.getQuantity());
            existing.setStatus(updatedProduct.getStatus());
            existing.setImageUrl(updatedProduct.getImageUrl());
            existing.setCategoryId(updatedProduct.getCategoryId());
            existing.setProductType(updatedProduct.getProductType());
            return productRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    // ── Categories ────────────────────────────────────────────
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        if (categoryRepository.existsByCategoryName(category.getCategoryName())) {
            throw new RuntimeException("Category already exists: " + category.getCategoryName());
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(String id, Category updated) {
        return categoryRepository.findById(id).map(existing -> {
            existing.setCategoryName(updated.getCategoryName());
            return categoryRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Category not found: " + id));
    }

    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }

    // ── Attributes ────────────────────────────────────────────
    public List<Attribute> getAllAttributes() {
        return attributeRepository.findAll();
    }

    public Optional<Attribute> getAttributeById(String id) {
        return attributeRepository.findById(id);
    }

    public Attribute createAttribute(Attribute attribute) {
        if (attributeRepository.existsByAttributeName(attribute.getAttributeName())) {
            throw new RuntimeException("Attribute already exists: " + attribute.getAttributeName());
        }
        return attributeRepository.save(attribute);
    }

    public Attribute updateAttribute(String id, Attribute updated) {
        return attributeRepository.findById(id).map(existing -> {
            existing.setAttributeName(updated.getAttributeName());
            existing.setSlug(updated.getSlug());
            return attributeRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Attribute not found: " + id));
    }

    public void deleteAttribute(String id) {
        attributeRepository.deleteById(id);
    }

    // ── Terms ─────────────────────────────────────────────────
    public List<Term> getAllTerms() {
        return termRepository.findAll();
    }

    public List<Term> getTermsByAttribute(String attributeId) {
        return termRepository.findByAttributeId(attributeId);
    }

    public Optional<Term> getTermById(String id) {
        return termRepository.findById(id);
    }

    public Term createTerm(Term term) {
        return termRepository.save(term);
    }

    public Term updateTerm(String id, Term updated) {
        return termRepository.findById(id).map(existing -> {
            existing.setTermName(updated.getTermName());
            existing.setSlug(updated.getSlug());
            existing.setPrice(updated.getPrice());
            existing.setAttributeId(updated.getAttributeId());
            return termRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Term not found: " + id));
    }

    public void deleteTerm(String id) {
        termRepository.deleteById(id);
    }
}
