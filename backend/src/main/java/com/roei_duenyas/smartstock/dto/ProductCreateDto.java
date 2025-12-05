package com.roei_duenyas.smartstock.dto;

import jakarta.validation.constraints.NotBlank; // Added import
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class ProductCreateDto {
    @NotBlank(message = "Product name cannot be empty") // Added validation
    private String name;
    @NotBlank(message = "Image URL cannot be empty") // Added validation
    private String imageUrl;
    private List<ProductVariantDto> variants; // רשימת הווריאציות (מידות) הראשוניות
}