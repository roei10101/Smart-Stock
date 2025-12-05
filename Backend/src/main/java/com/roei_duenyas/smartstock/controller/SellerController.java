package com.roei_duenyas.smartstock.controller;

import com.roei_duenyas.smartstock.dto.SellerCreateDto;
import com.roei_duenyas.smartstock.dto.SellerDto;
import com.roei_duenyas.smartstock.dto.SellerStatsDto;
import com.roei_duenyas.smartstock.service.SellerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sellers")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;

    @GetMapping
    public ResponseEntity<List<SellerDto>> getAllSellers() {
        return ResponseEntity.ok(sellerService.getAllSellers());
    }

    @GetMapping("/stats")
    public ResponseEntity<List<SellerStatsDto>> getSellerStats() {
        return ResponseEntity.ok(sellerService.getSellerStats());
    }

    @PostMapping
    public ResponseEntity<SellerDto> createSeller(@Valid @RequestBody SellerCreateDto sellerCreateDto) {
        SellerDto createdSeller = sellerService.createSeller(sellerCreateDto);
        return new ResponseEntity<>(createdSeller, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SellerDto> updateSeller(
            @PathVariable("id") Long sellerId,
            @Valid @RequestBody SellerCreateDto sellerCreateDto) {
        SellerDto updatedSeller = sellerService.updateSeller(sellerId, sellerCreateDto);
        return ResponseEntity.ok(updatedSeller);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable("id") Long sellerId) {
        sellerService.deleteSeller(sellerId);
        return ResponseEntity.noContent().build();
    }
}