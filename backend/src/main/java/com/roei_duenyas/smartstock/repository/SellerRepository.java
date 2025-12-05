package com.roei_duenyas.smartstock.repository;

import com.roei_duenyas.smartstock.dto.SellerBalanceDto;
import com.roei_duenyas.smartstock.dto.SellerStatsDto;
import com.roei_duenyas.smartstock.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {
    Optional<Seller> findByName(String name);

    @Query("SELECT new com.roei_duenyas.smartstock.dto.SellerStatsDto(s.name, COUNT(sa), SUM(sa.totalPrice), " +
           "(SELECT COALESCE(SUM(ex.amount), 0) FROM Expense ex WHERE ex.seller = s), " +
           "SUM(sa.totalPrice) - (SELECT COALESCE(SUM(ex.amount), 0) FROM Expense ex WHERE ex.seller = s)) " +
           "FROM Seller s LEFT JOIN s.sales sa " +
           "GROUP BY s.id, s.name " +
           "ORDER BY SUM(sa.totalPrice) DESC")
    List<SellerStatsDto> findSellerStats();

    @Query("SELECT new com.roei_duenyas.smartstock.dto.SellerBalanceDto(s.id, s.name, " +
           "(SELECT COALESCE(SUM(sa.totalPrice), 0) FROM Sale sa WHERE sa.seller = s), " +
           "(SELECT COALESCE(SUM(ex.amount), 0) FROM Expense ex WHERE ex.seller = s), " +
           "(SELECT COALESCE(SUM(sa.totalPrice), 0) FROM Sale sa WHERE sa.seller = s) - (SELECT COALESCE(SUM(ex.amount), 0) FROM Expense ex WHERE ex.seller = s)) " +
           "FROM Seller s")
    List<SellerBalanceDto> findSellerBalances();
}