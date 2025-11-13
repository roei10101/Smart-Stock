package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.ProductCreateDto;
import com.roei_duenyas.smartstock.dto.ProductDto;

import java.util.List;

public interface ProductService {

    ProductDto createProduct(ProductCreateDto productCreateDto);

    List<ProductDto> getAllProducts();

    ProductDto getProductById(Long productId);

    // נשתמש באותו DTO לעדכון, אך נוכל ליצור DTO נפרד אם יש צורך
    ProductDto updateProduct(Long productId, ProductCreateDto productDetails);

    void deleteProduct(Long productId);
}