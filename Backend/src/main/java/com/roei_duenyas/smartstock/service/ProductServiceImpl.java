package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.ProductCreateDto;
import com.roei_duenyas.smartstock.dto.ProductDto;
import com.roei_duenyas.smartstock.dto.ProductVariantDto;
import com.roei_duenyas.smartstock.entity.Product;
import com.roei_duenyas.smartstock.entity.ProductVariant;
import com.roei_duenyas.smartstock.exception.ResourceNotFoundException;
import com.roei_duenyas.smartstock.repository.ProductRepository;
import com.roei_duenyas.smartstock.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    @Transactional
    public ProductDto createProduct(ProductCreateDto productCreateDto) {
        Product product = new Product();
        product.setName(productCreateDto.getName());
        product.setImageUrl(productCreateDto.getImageUrl());

        List<ProductVariant> variants = new ArrayList<>();
        if (productCreateDto.getVariants() != null) {
            for (ProductVariantDto variantDto : productCreateDto.getVariants()) {
                ProductVariant variant = new ProductVariant();
                variant.setSize(variantDto.getSize());
                variant.setQuantity(variantDto.getQuantity());
                variant.setProduct(product);
                variants.add(variant);
            }
        }
        product.setVariants(variants);

        Product savedProduct = productRepository.save(product);
        return toDto(savedProduct);
    }

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        return toDto(product);
    }

    @Override
    @Transactional
    public ProductDto updateProduct(Long productId, ProductCreateDto productDetails) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        existingProduct.setName(productDetails.getName());
        existingProduct.setImageUrl(productDetails.getImageUrl());

        Map<String, ProductVariant> existingVariantsMap = existingProduct.getVariants().stream()
                .collect(Collectors.toMap(ProductVariant::getSize, Function.identity()));

        List<ProductVariant> updatedVariants = new ArrayList<>();
        if (productDetails.getVariants() != null) {
            for (ProductVariantDto variantDto : productDetails.getVariants()) {
                ProductVariant existingVariant = existingVariantsMap.get(variantDto.getSize());
                if (existingVariant != null) {
                    existingVariant.setQuantity(variantDto.getQuantity());
                    updatedVariants.add(existingVariant);
                    existingVariantsMap.remove(variantDto.getSize());
                } else {
                    ProductVariant newVariant = new ProductVariant();
                    newVariant.setSize(variantDto.getSize());
                    newVariant.setQuantity(variantDto.getQuantity());
                    newVariant.setProduct(existingProduct);
                    updatedVariants.add(newVariant);
                }
            }
        }

        existingProduct.getVariants().clear();
        existingProduct.getVariants().addAll(updatedVariants);
        
        productVariantRepository.deleteAll(existingVariantsMap.values());


        Product updatedProduct = productRepository.save(existingProduct);
        return toDto(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        productRepository.delete(product);
    }

    private ProductDto toDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setImageUrl(product.getImageUrl());

        if (product.getVariants() != null) {
            dto.setVariants(product.getVariants().stream().map(this::toVariantDto).collect(Collectors.toList()));
            dto.setTotalStock(product.getVariants().stream().mapToInt(ProductVariant::getQuantity).sum());
        } else {
            dto.setTotalStock(0);
        }
        return dto;
    }

    private ProductVariantDto toVariantDto(ProductVariant variant) {
        ProductVariantDto dto = new ProductVariantDto();
        dto.setId(variant.getId());
        dto.setSize(variant.getSize());
        dto.setQuantity(variant.getQuantity());
        return dto;
    }
}