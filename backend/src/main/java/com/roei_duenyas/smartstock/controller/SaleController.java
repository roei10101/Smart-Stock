package com.roei_duenyas.smartstock.controller;

import com.roei_duenyas.smartstock.dto.SaleCreateDto;
import com.roei_duenyas.smartstock.dto.SaleDto;
import com.roei_duenyas.smartstock.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling sales-related API requests.
 */
@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    /**
     * Constructor-based dependency injection for the SaleService.
     * @param saleService The service that handles business logic for sales.
     */
    @Autowired
    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    /**
     * Endpoint to create a new sale.
     * Accepts a SaleCreateDto and returns the created sale's details.
     *
     * @param saleCreateDto DTO containing the details for the new sale.
     * @return ResponseEntity containing the created SaleDto and HTTP status 201 (Created).
     */
    @PostMapping
    public ResponseEntity<SaleDto> createSale(@Valid @RequestBody SaleCreateDto saleCreateDto) {
        SaleDto createdSale = saleService.createSale(saleCreateDto);
        return new ResponseEntity<>(createdSale, HttpStatus.CREATED);
    }

    /**
     * Endpoint to retrieve a list of all sales.
     *
     * @return ResponseEntity containing a list of all SaleDto objects and HTTP status 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<SaleDto>> getAllSales() {
        List<SaleDto> sales = saleService.getAllSales();
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaleDto> getSaleById(@PathVariable("id") Long saleId) {
        return ResponseEntity.ok(saleService.getSaleById(saleId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SaleDto> updateSale(@PathVariable("id") Long saleId, @Valid @RequestBody SaleCreateDto saleDetails) {
        SaleDto updatedSale = saleService.updateSale(saleId, saleDetails);
        return ResponseEntity.ok(updatedSale);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable("id") Long saleId) {
        saleService.deleteSale(saleId);
        return ResponseEntity.noContent().build(); // מחזיר סטטוס 204 No Content
    }
}