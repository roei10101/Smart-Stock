package com.roei_duenyas.smartstock.controller;

import com.roei_duenyas.smartstock.dto.ExpenseCreateDto;
import com.roei_duenyas.smartstock.dto.ExpenseDto;
import com.roei_duenyas.smartstock.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDto> createExpense(@Valid @RequestBody ExpenseCreateDto expenseCreateDto) {
        ExpenseDto createdExpense = expenseService.createExpense(expenseCreateDto);
        return new ResponseEntity<>(createdExpense, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDto>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDto> updateExpense(
            @PathVariable("id") Long expenseId,
            @Valid @RequestBody ExpenseCreateDto expenseCreateDto) {
        ExpenseDto updatedExpense = expenseService.updateExpense(expenseId, expenseCreateDto);
        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable("id") Long expenseId) {
        expenseService.deleteExpense(expenseId);
        return ResponseEntity.noContent().build();
    }
}