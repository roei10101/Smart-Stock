package com.roei_duenyas.smartstock.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerCreateDto {
    @NotBlank(message = "Seller name cannot be empty")
    private String name;
}