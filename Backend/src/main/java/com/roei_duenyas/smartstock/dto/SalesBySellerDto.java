package com.roei_duenyas.smartstock.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class SalesBySellerDto {
    private String sellerName;
    private Long totalQuantity;
    private BigDecimal totalRevenue;
}