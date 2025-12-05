package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.ExpenseCreateDto;
import com.roei_duenyas.smartstock.dto.ExpenseDto;

import java.util.List;

public interface ExpenseService {
    ExpenseDto createExpense(ExpenseCreateDto expenseCreateDto);
    List<ExpenseDto> getAllExpenses();
    ExpenseDto updateExpense(Long expenseId, ExpenseCreateDto expenseCreateDto);
    void deleteExpense(Long expenseId);
}