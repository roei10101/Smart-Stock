package com.roei_duenyas.smartstock.controller;

import com.roei_duenyas.smartstock.dto.ProductCreateDto; // Make sure this is imported
import com.roei_duenyas.smartstock.dto.ProductDto;
import com.roei_duenyas.smartstock.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductCreateDto productCreateDto) {
        ProductDto createdProduct = productService.createProduct(productCreateDto);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable("id") Long productId) {
        return ResponseEntity.ok(productService.getProductById(productId));
    }

    // --- This is the corrected method ---
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable("id") Long productId,
            @Valid @RequestBody ProductCreateDto productDetails // Changed from ProductDto to ProductCreateDto
    ) {
        return ResponseEntity.ok(productService.updateProduct(productId, productDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
}