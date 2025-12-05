package com.roei_duenyas.smartstock.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class FinancialBalanceDto {
    private StoreSummaryDto storeSummary;
    private List<SellerBalanceDto> sellerBreakdown;
}