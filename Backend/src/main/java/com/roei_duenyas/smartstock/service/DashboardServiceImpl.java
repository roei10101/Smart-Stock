package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.*;
import com.roei_duenyas.smartstock.entity.Seller;
import com.roei_duenyas.smartstock.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final SaleRepository saleRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CustomerRepository customerRepository;
    private final SellerRepository sellerRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryDto getSummaryStats() {
        Long totalSales = saleRepository.count();
        BigDecimal totalRevenue = saleRepository.getTotalRevenue();
        
        Long totalProductsInStock = productVariantRepository.findAll().stream()
                .map(variant -> variant.getQuantity() != null ? variant.getQuantity().longValue() : 0L)
                .reduce(0L, Long::sum);

        Long totalCustomers = customerRepository.count();
        Long totalSellers = sellerRepository.count();

        return new DashboardSummaryDto(totalSales, totalRevenue, totalProductsInStock, totalCustomers, totalSellers);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalesByProductDto> getSalesByProductStats() {
        return saleRepository.findSalesByProductStats();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalesBySellerDto> getSalesBySellerStats() {
        return saleRepository.findSalesBySellerStats();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalesOverTimeDto> getSalesOverTimeStats() {
        return saleRepository.findSalesOverTimeStats();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalesDistributionByProductDto> getSalesDistributionByProductStats() {
        return saleRepository.findSalesDistributionByProductStats();
    }

    @Override
    @Transactional(readOnly = true)
    public FinancialBalanceDto getFinancialBalance() {
        BigDecimal totalRevenue = saleRepository.getTotalRevenue();
        BigDecimal totalExpenses = expenseRepository.getTotalExpenses();
        BigDecimal netBalance = totalRevenue.subtract(totalExpenses);

        StoreSummaryDto storeSummary = new StoreSummaryDto(totalRevenue, totalExpenses, netBalance);

        Map<Long, BigDecimal> revenueBySeller = saleRepository.findTotalRevenueBySeller().stream()
                .collect(Collectors.toMap(
                        result -> (Long) result[0],
                        result -> (BigDecimal) result[1]
                ));

        Map<Long, BigDecimal> expensesBySeller = expenseRepository.findTotalExpensesBySeller().stream()
                .collect(Collectors.toMap(
                        result -> (Long) result[0],
                        result -> (BigDecimal) result[1]
                ));

        List<SellerBalanceDto> sellerBreakdown = sellerRepository.findAll().stream()
                .map(seller -> {
                    BigDecimal sellerRevenue = revenueBySeller.getOrDefault(seller.getId(), BigDecimal.ZERO);
                    BigDecimal sellerExpenses = expensesBySeller.getOrDefault(seller.getId(), BigDecimal.ZERO);
                    BigDecimal sellerNetBalance = sellerRevenue.subtract(sellerExpenses);
                    return new SellerBalanceDto(seller.getId(), seller.getName(), sellerRevenue, sellerExpenses, sellerNetBalance);
                })
                .collect(Collectors.toList());

        return new FinancialBalanceDto(storeSummary, sellerBreakdown);
    }
}