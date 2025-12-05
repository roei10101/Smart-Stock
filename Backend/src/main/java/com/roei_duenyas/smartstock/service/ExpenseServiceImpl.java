package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.ExpenseCreateDto;
import com.roei_duenyas.smartstock.dto.ExpenseDto;
import com.roei_duenyas.smartstock.entity.Expense;
import com.roei_duenyas.smartstock.entity.Seller;
import com.roei_duenyas.smartstock.exception.ResourceNotFoundException;
import com.roei_duenyas.smartstock.repository.ExpenseRepository;
import com.roei_duenyas.smartstock.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final SellerRepository sellerRepository;

    @Override
    @Transactional
    public ExpenseDto createExpense(ExpenseCreateDto expenseCreateDto) {
        Seller seller = sellerRepository.findById(expenseCreateDto.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + expenseCreateDto.getSellerId()));

        Expense expense = new Expense();
        expense.setDescription(expenseCreateDto.getDescription());
        expense.setAmount(expenseCreateDto.getAmount());
        expense.setSeller(seller);
        expense.setExpenseDate(expenseCreateDto.getDate().atStartOfDay()); // Use renamed field

        Expense savedExpense = expenseRepository.save(expense);
        return toDto(savedExpense);
    }

    @Override
    public List<ExpenseDto> getAllExpenses() {
        return expenseRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExpenseDto updateExpense(Long expenseId, ExpenseCreateDto expenseCreateDto) {
        Expense existingExpense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        Seller seller = sellerRepository.findById(expenseCreateDto.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + expenseCreateDto.getSellerId()));

        existingExpense.setDescription(expenseCreateDto.getDescription());
        existingExpense.setAmount(expenseCreateDto.getAmount());
        existingExpense.setSeller(seller);
        existingExpense.setExpenseDate(expenseCreateDto.getDate().atStartOfDay()); // Use renamed field

        Expense updatedExpense = expenseRepository.save(existingExpense);
        return toDto(updatedExpense);
    }

    @Override
    @Transactional
    public void deleteExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));
        expenseRepository.delete(expense);
    }

    private ExpenseDto toDto(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setDescription(expense.getDescription());
        dto.setAmount(expense.getAmount());
        dto.setDate(expense.getExpenseDate()); // Use renamed field
        if (expense.getSeller() != null) {
            dto.setSellerId(expense.getSeller().getId());
            dto.setSellerName(expense.getSeller().getName());
        }
        return dto;
    }
}