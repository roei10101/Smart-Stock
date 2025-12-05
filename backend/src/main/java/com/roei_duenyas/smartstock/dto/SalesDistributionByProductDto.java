package com.roei_duenyas.smartstock.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class SalesDistributionByProductDto {
    private String productName;
    private BigDecimal value; // Represents total revenue for the product
}