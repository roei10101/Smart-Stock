package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.DashboardSummaryDto;
import com.roei_duenyas.smartstock.dto.SalesByProductDto;
import com.roei_duenyas.smartstock.dto.SalesBySellerDto;
import com.roei_duenyas.smartstock.dto.SalesDistributionByProductDto;
import com.roei_duenyas.smartstock.dto.SalesOverTimeDto;
import com.roei_duenyas.smartstock.repository.CustomerRepository;
import com.roei_duenyas.smartstock.repository.ProductVariantRepository;
import com.roei_duenyas.smartstock.repository.SaleRepository;
import com.roei_duenyas.smartstock.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final SaleRepository saleRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CustomerRepository customerRepository;
    private final SellerRepository sellerRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryDto getSummaryStats() {
        Long totalSales = saleRepository.count();
        BigDecimal totalRevenue = saleRepository.findAll().stream()
                .map(sale -> sale.getTotalPrice() != null ? sale.getTotalPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
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
}