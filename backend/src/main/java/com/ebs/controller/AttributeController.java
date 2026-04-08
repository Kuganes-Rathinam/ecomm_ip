package com.ebs.controller;

import com.ebs.model.Attribute;
import com.ebs.service.CatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attributes")
@RequiredArgsConstructor
public class AttributeController {

    private final CatalogService catalogService;

    @GetMapping
    public ResponseEntity<List<Attribute>> getAll() {
        return ResponseEntity.ok(catalogService.getAllAttributes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attribute> getById(@PathVariable String id) {
        return catalogService.getAttributeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Attribute> create(@Valid @RequestBody Attribute attribute) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.createAttribute(attribute));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Attribute> update(@PathVariable String id, @RequestBody Attribute attribute) {
        return ResponseEntity.ok(catalogService.updateAttribute(id, attribute));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        catalogService.deleteAttribute(id);
        return ResponseEntity.noContent().build();
    }
}
