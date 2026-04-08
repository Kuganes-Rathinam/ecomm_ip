package com.ebs.controller;

import com.ebs.model.Term;
import com.ebs.service.CatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/terms")
@RequiredArgsConstructor
public class TermController {

    private final CatalogService catalogService;

    @GetMapping
    public ResponseEntity<List<Term>> getAll() {
        return ResponseEntity.ok(catalogService.getAllTerms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Term> getById(@PathVariable String id) {
        return catalogService.getTermById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/attribute/{attributeId}")
    public ResponseEntity<List<Term>> getByAttribute(@PathVariable String attributeId) {
        return ResponseEntity.ok(catalogService.getTermsByAttribute(attributeId));
    }

    @PostMapping
    public ResponseEntity<Term> create(@Valid @RequestBody Term term) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.createTerm(term));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Term> update(@PathVariable String id, @RequestBody Term term) {
        return ResponseEntity.ok(catalogService.updateTerm(id, term));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        catalogService.deleteTerm(id);
        return ResponseEntity.noContent().build();
    }
}
