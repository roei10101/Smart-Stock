package com.roei_duenyas.smartstock.controller;

import com.roei_duenyas.smartstock.dto.*;
import com.roei_duenyas.smartstock.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getSummaryStats() {
        return ResponseEntity.ok(dashboardService.getSummaryStats());
    }

    @GetMapping("/sales-by-product")
    public ResponseEntity<List<SalesByProductDto>> getSalesByProductStats() {
        return ResponseEntity.ok(dashboardService.getSalesByProductStats());
    }

    @GetMapping("/sales-by-seller")
    public ResponseEntity<List<SalesBySellerDto>> getSalesBySellerStats() {
        return ResponseEntity.ok(dashboardService.getSalesBySellerStats());
    }

    @GetMapping("/sales-over-time")
    public ResponseEntity<List<SalesOverTimeDto>> getSalesOverTimeStats() {
        return ResponseEntity.ok(dashboardService.getSalesOverTimeStats());
    }

    @GetMapping("/sales-distribution-by-product")
    public ResponseEntity<List<SalesDistributionByProductDto>> getSalesDistributionByProductStats() {
        return ResponseEntity.ok(dashboardService.getSalesDistributionByProductStats());
    }
}