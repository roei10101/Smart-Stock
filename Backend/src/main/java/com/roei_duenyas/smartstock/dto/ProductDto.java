package com.roei_duenyas.smartstock.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProductDto {
    private Long id;
    private String name;
    private String imageUrl;
    private List<ProductVariantDto> variants;
    private Integer totalStock;
}