package com.roei_duenyas.smartstock.dto;

import com.fasterxml.jackson.annotation.JsonFormat; // New import
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class ExpenseDto {
    private Long id;
    private String description;
    private BigDecimal amount;
    
    @JsonFormat(pattern = "yyyy-MM-dd") // Format the date for the frontend
    private LocalDateTime date; // Renamed from expenseDate
    
    private Long sellerId;
    private String sellerName;
}