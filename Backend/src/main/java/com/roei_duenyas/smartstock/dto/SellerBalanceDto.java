package com.roei_duenyas.smartstock.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class SellerBalanceDto {
    private Long sellerId;
    private String sellerName;
    private BigDecimal totalRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;
}