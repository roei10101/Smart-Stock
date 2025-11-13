package com.roei_duenyas.smartstock.repository;

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

    @Query("SELECT new com.roei_duenyas.smartstock.dto.SellerStatsDto(s.name, COUNT(sa), SUM(sa.totalPrice)) " +
           "FROM Seller s JOIN s.sales sa " +
           "GROUP BY s.name " +
           "ORDER BY SUM(sa.totalPrice) DESC")
    List<SellerStatsDto> findSellerStats();
}