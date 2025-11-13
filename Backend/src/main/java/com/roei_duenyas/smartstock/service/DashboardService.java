package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.DashboardSummaryDto;
import com.roei_duenyas.smartstock.dto.SalesByProductDto;
import com.roei_duenyas.smartstock.dto.SalesBySellerDto;
import com.roei_duenyas.smartstock.dto.SalesDistributionByProductDto;
import com.roei_duenyas.smartstock.dto.SalesOverTimeDto;

import java.util.List;

public interface DashboardService {
    DashboardSummaryDto getSummaryStats();
    List<SalesByProductDto> getSalesByProductStats();
    List<SalesBySellerDto> getSalesBySellerStats();
    List<SalesOverTimeDto> getSalesOverTimeStats();
    List<SalesDistributionByProductDto> getSalesDistributionByProductStats();
}