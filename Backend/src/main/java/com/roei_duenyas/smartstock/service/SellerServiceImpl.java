package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.SellerCreateDto;
import com.roei_duenyas.smartstock.dto.SellerDto;
import com.roei_duenyas.smartstock.dto.SellerStatsDto;
import com.roei_duenyas.smartstock.entity.Seller;
import com.roei_duenyas.smartstock.exception.ResourceNotFoundException;
import com.roei_duenyas.smartstock.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;

    @Override
    public List<SellerDto> getAllSellers() {
        return sellerRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SellerStatsDto> getSellerStats() {
        return sellerRepository.findSellerStats();
    }

    @Override
    @Transactional
    public SellerDto createSeller(SellerCreateDto sellerCreateDto) {
        // Optional: Check if seller with the same name already exists
        sellerRepository.findByName(sellerCreateDto.getName()).ifPresent(s -> {
            throw new IllegalStateException("Seller with name '" + s.getName() + "' already exists.");
        });

        Seller newSeller = new Seller();
        newSeller.setName(sellerCreateDto.getName());
        
        Seller savedSeller = sellerRepository.save(newSeller);
        return toDto(savedSeller);
    }

    @Override
    @Transactional
    public SellerDto updateSeller(Long sellerId, SellerCreateDto sellerCreateDto) {
        Seller existingSeller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + sellerId));

        existingSeller.setName(sellerCreateDto.getName());
        
        Seller updatedSeller = sellerRepository.save(existingSeller);
        return toDto(updatedSeller);
    }

    @Override
    @Transactional
    public void deleteSeller(Long sellerId) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + sellerId));
        sellerRepository.delete(seller);
    }

    private SellerDto toDto(Seller seller) {
        SellerDto dto = new SellerDto();
        dto.setId(seller.getId());
        dto.setName(seller.getName());
        return dto;
    }
}