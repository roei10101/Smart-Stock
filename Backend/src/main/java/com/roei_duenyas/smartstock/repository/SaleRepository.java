package com.roei_duenyas.smartstock.repository;

import com.roei_duenyas.smartstock.dto.SalesByProductDto;
import com.roei_duenyas.smartstock.dto.SalesBySellerDto;
import com.roei_duenyas.smartstock.dto.SalesDistributionByProductDto;
import com.roei_duenyas.smartstock.dto.SalesOverTimeDto;
import com.roei_duenyas.smartstock.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    @Query("SELECT s FROM Sale s JOIN FETCH s.productVariant pv JOIN FETCH pv.product JOIN FETCH s.customer JOIN FETCH s.seller")
    List<Sale> findAllWithDetails();

    @Query("SELECT new com.roei_duenyas.smartstock.dto.SalesByProductDto(pv.product.name, SUM(s.quantity), SUM(s.totalPrice)) " +
           "FROM Sale s JOIN s.productVariant pv " +
           "GROUP BY pv.product.name " +
           "ORDER BY SUM(s.totalPrice) DESC")
    List<SalesByProductDto> findSalesByProductStats();

    @Query("SELECT new com.roei_duenyas.smartstock.dto.SalesBySellerDto(s.seller.name, SUM(s.quantity), SUM(s.totalPrice)) " +
           "FROM Sale s " +
           "GROUP BY s.seller.name " +
           "ORDER BY SUM(s.totalPrice) DESC")
    List<SalesBySellerDto> findSalesBySellerStats();

    @Query("SELECT new com.roei_duenyas.smartstock.dto.SalesOverTimeDto(CAST(FUNCTION('TO_CHAR', s.saleDate, 'YYYY-MM-DD') as string), SUM(s.quantity), SUM(s.totalPrice)) " +
           "FROM Sale s " +
           "GROUP BY FUNCTION('TO_CHAR', s.saleDate, 'YYYY-MM-DD') " +
           "ORDER BY FUNCTION('TO_CHAR', s.saleDate, 'YYYY-MM-DD') ASC")
    List<SalesOverTimeDto> findSalesOverTimeStats();

    @Query("SELECT new com.roei_duenyas.smartstock.dto.SalesDistributionByProductDto(pv.product.name, SUM(s.totalPrice)) " +
           "FROM Sale s JOIN s.productVariant pv " +
           "GROUP BY pv.product.name " +
           "ORDER BY SUM(s.totalPrice) DESC")
    List<SalesDistributionByProductDto> findSalesDistributionByProductStats();

    @Query("SELECT COALESCE(SUM(s.totalPrice), 0) FROM Sale s")
    BigDecimal getTotalRevenue();

    @Query("SELECT s.seller.id, SUM(s.totalPrice) FROM Sale s GROUP BY s.seller.id")
    List<Object[]> findTotalRevenueBySeller();
}