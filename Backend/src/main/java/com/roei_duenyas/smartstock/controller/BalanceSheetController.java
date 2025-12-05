package com.roei_duenyas.smartstock.controller;

import com.roei_duenyas.smartstock.dto.FinancialBalanceDto;
import com.roei_duenyas.smartstock.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BalanceSheetController {

    private final DashboardService dashboardService;

    @GetMapping("/balance-sheet")
    public ResponseEntity<FinancialBalanceDto> getBalanceSheet() {
        return ResponseEntity.ok(dashboardService.getFinancialBalance());
    }
}