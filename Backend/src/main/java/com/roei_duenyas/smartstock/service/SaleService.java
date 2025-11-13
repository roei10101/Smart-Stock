package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.SaleCreateDto;
import com.roei_duenyas.smartstock.dto.SaleDto;

import java.util.List;

/**
 * Service interface for managing sales.
 */
public interface SaleService {

    /**
     * Creates a new sale based on the provided DTO.
     * @param saleCreateDto DTO containing information for the new sale.
     * @return The created sale as a DTO.
     */
    SaleDto createSale(SaleCreateDto saleCreateDto);

    /**
     * Retrieves a list of all sales.
     * @return A list of all sales as DTOs.
     */
    List<SaleDto> getAllSales();

    /**
     * Retrieves a single sale by its ID.
     * @param saleId The ID of the sale to retrieve.
     * @return The sale as a DTO.
     */
    SaleDto getSaleById(Long saleId);

    SaleDto updateSale(Long saleId, SaleCreateDto saleDetails);
    void deleteSale(Long saleId);
}