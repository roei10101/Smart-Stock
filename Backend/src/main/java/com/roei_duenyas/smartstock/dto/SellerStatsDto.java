package com.roei_duenyas.smartstock.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class SellerStatsDto {
    private String name; // Renamed from sellerName to name
    private long totalSales;
    private BigDecimal totalRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;
}