package com.roei_duenyas.smartstock.repository;

import com.roei_duenyas.smartstock.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e")
    BigDecimal getTotalExpenses();

    @Query("SELECT e.seller.id, SUM(e.amount) FROM Expense e GROUP BY e.seller.id")
    List<Object[]> findTotalExpensesBySeller();
}