package com.roei_duenyas.smartstock.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
public class SaleCreateDto {
    @NotNull(message = "Product ID cannot be null")
    private Long productId;

    @NotBlank(message = "Selected size cannot be empty")
    private String selectedSize;

    @NotBlank(message = "Customer name cannot be empty")
    private String customerName;

    @NotNull(message = "Seller ID cannot be null")
    private Long sellerId; // Changed from sellerName to sellerId

    @NotNull(message = "Quantity cannot be null")
    private Integer quantity;

    @NotNull(message = "Total price cannot be null")
    private BigDecimal totalPrice;
}