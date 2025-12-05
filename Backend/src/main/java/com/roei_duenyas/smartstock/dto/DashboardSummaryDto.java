package com.roei_duenyas.smartstock.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class DashboardSummaryDto {
    private Long totalSales;
    private BigDecimal totalRevenue;
    private Long totalProductsInStock;
    private Long totalCustomers;
    private Long totalSellers;
}