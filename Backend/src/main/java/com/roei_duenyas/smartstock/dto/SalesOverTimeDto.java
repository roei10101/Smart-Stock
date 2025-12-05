package com.roei_duenyas.smartstock.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class SalesOverTimeDto {
    private String date; // e.g., "YYYY-MM-DD" or "YYYY-MM"
    private Long totalQuantity;
    private BigDecimal totalRevenue;
}