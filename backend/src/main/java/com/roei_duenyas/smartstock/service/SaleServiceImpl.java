package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.SaleCreateDto;
import com.roei_duenyas.smartstock.dto.SaleDto;
import com.roei_duenyas.smartstock.entity.Customer;
import com.roei_duenyas.smartstock.entity.ProductVariant;
import com.roei_duenyas.smartstock.entity.Sale;
import com.roei_duenyas.smartstock.entity.Seller;
import com.roei_duenyas.smartstock.exception.ResourceNotFoundException;
import com.roei_duenyas.smartstock.repository.CustomerRepository;
import com.roei_duenyas.smartstock.repository.ProductVariantRepository;
import com.roei_duenyas.smartstock.repository.SaleRepository;
import com.roei_duenyas.smartstock.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CustomerRepository customerRepository;
    private final SellerRepository sellerRepository;

    @Override
    @Transactional
    public SaleDto createSale(SaleCreateDto saleCreateDto) {
        ProductVariant variant = productVariantRepository.findByProductIdAndSize(saleCreateDto.getProductId(), saleCreateDto.getSelectedSize())
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found for product id: " + saleCreateDto.getProductId() + " and size: " + saleCreateDto.getSelectedSize()));

        Customer customer = customerRepository.findByNameIgnoreCase(saleCreateDto.getCustomerName())
                .orElseGet(() -> {
                    Customer newCustomer = new Customer();
                    newCustomer.setName(saleCreateDto.getCustomerName());
                    return customerRepository.save(newCustomer);
                });

        Seller seller = sellerRepository.findById(saleCreateDto.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + saleCreateDto.getSellerId()));

        if (variant.getQuantity() < saleCreateDto.getQuantity()) {
            throw new IllegalStateException("Not enough stock for: " + variant.getProduct().getName() + " size: " + variant.getSize());
        }

        variant.setQuantity(variant.getQuantity() - saleCreateDto.getQuantity());
        productVariantRepository.save(variant);

        Sale newSale = new Sale();
        newSale.setProductVariant(variant);
        newSale.setCustomer(customer);
        newSale.setSeller(seller);
        newSale.setQuantity(saleCreateDto.getQuantity());
        newSale.setTotalPrice(saleCreateDto.getTotalPrice());

        Sale savedSale = saleRepository.save(newSale);
        return toDto(savedSale);
    }
    
    @Override
    public SaleDto getSaleById(Long saleId) {
        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + saleId));
        return toDto(sale);
    }

    @Override
    public List<SaleDto> getAllSales() {
        return saleRepository.findAllWithDetails().stream().map(this::toDto).collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public SaleDto updateSale(Long saleId, SaleCreateDto saleDetails) {
        Sale existingSale = saleRepository.findById(saleId)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + saleId));

        // Revert stock for the old product variant
        ProductVariant oldVariant = existingSale.getProductVariant();
        oldVariant.setQuantity(oldVariant.getQuantity() + existingSale.getQuantity());
        productVariantRepository.save(oldVariant);

        // Find new product variant
        ProductVariant newVariant = productVariantRepository.findByProductIdAndSize(saleDetails.getProductId(), saleDetails.getSelectedSize())
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found for product id: " + saleDetails.getProductId() + " and size: " + saleDetails.getSelectedSize()));

        // Find customer
        Customer customer = customerRepository.findByNameIgnoreCase(saleDetails.getCustomerName())
                .orElseGet(() -> {
                    Customer newCustomer = new Customer();
                    newCustomer.setName(saleDetails.getCustomerName());
                    return customerRepository.save(newCustomer);
                });

        // Find seller
        Seller seller = sellerRepository.findById(saleDetails.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + saleDetails.getSellerId()));

        // Check stock for new variant
        if (newVariant.getQuantity() < saleDetails.getQuantity()) {
            // If not enough stock, revert old variant's stock and throw exception
            oldVariant.setQuantity(oldVariant.getQuantity() - existingSale.getQuantity()); // Revert the revert
            productVariantRepository.save(oldVariant);
            throw new IllegalStateException("Not enough stock for: " + newVariant.getProduct().getName() + " size: " + newVariant.getSize());
        }

        // Deduct stock for the new product variant
        newVariant.setQuantity(newVariant.getQuantity() - saleDetails.getQuantity());
        productVariantRepository.save(newVariant);

        // Update sale details
        existingSale.setProductVariant(newVariant);
        existingSale.setCustomer(customer);
        existingSale.setSeller(seller);
        existingSale.setQuantity(saleDetails.getQuantity());
        existingSale.setTotalPrice(saleDetails.getTotalPrice());

        Sale updatedSale = saleRepository.save(existingSale);
        return toDto(updatedSale);
    }

    @Override
    @Transactional
    public void deleteSale(Long saleId) {
        Sale saleToDelete = saleRepository.findById(saleId)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + saleId));

        // Re-add the stock to the product variant
        ProductVariant variant = saleToDelete.getProductVariant();
        variant.setQuantity(variant.getQuantity() + saleToDelete.getQuantity());
        productVariantRepository.save(variant);

        saleRepository.delete(saleToDelete);
    }

    private SaleDto toDto(Sale sale) {
        SaleDto dto = new SaleDto();
        dto.setId(sale.getId());
        dto.setQuantity(sale.getQuantity());
        dto.setTotalPrice(sale.getTotalPrice());
        dto.setSaleDate(sale.getSaleDate());

        if (sale.getProductVariant() != null) {
            dto.setProductVariantId(sale.getProductVariant().getId());
            dto.setProductSize(sale.getProductVariant().getSize());
            if (sale.getProductVariant().getProduct() != null) {
                dto.setProductName(sale.getProductVariant().getProduct().getName());
            }
        }
        if (sale.getCustomer() != null) {
            dto.setCustomerId(sale.getCustomer().getId());
            dto.setCustomerName(sale.getCustomer().getName());
        }
        if (sale.getSeller() != null) {
            dto.setSellerName(sale.getSeller().getName());
        }
        return dto;
    }
}