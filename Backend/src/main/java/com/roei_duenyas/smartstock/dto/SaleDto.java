package com.roei_duenyas.smartstock.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class SaleDto {
    private Long id;
    private Long productVariantId;
    private String productName;
    private String productSize;
    private Long customerId;
    private String customerName;
    private String sellerName; // Added seller name
    private Integer quantity;
    private BigDecimal totalPrice;
    private LocalDateTime saleDate;
}