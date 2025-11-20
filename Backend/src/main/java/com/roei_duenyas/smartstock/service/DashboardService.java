package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.*;

import java.util.List;

public interface DashboardService {
    DashboardSummaryDto getSummaryStats();
    List<SalesByProductDto> getSalesByProductStats();
    List<SalesBySellerDto> getSalesBySellerStats();
    List<SalesOverTimeDto> getSalesOverTimeStats();
    List<SalesDistributionByProductDto> getSalesDistributionByProductStats();
    FinancialBalanceDto getFinancialBalance();
}