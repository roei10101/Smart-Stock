package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.SellerCreateDto;
import com.roei_duenyas.smartstock.dto.SellerDto;
import com.roei_duenyas.smartstock.dto.SellerStatsDto;

import java.util.List;

public interface SellerService {
    List<SellerDto> getAllSellers();
    List<SellerStatsDto> getSellerStats();
    SellerDto createSeller(SellerCreateDto sellerCreateDto);
    SellerDto updateSeller(Long sellerId, SellerCreateDto sellerCreateDto);
    void deleteSeller(Long sellerId);
}