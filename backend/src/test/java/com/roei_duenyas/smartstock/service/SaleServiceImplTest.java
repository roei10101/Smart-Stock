package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.SaleCreateDto;
import com.roei_duenyas.smartstock.dto.SaleDto;
import com.roei_duenyas.smartstock.entity.Customer;
import com.roei_duenyas.smartstock.entity.Product;
import com.roei_duenyas.smartstock.entity.ProductVariant;
import com.roei_duenyas.smartstock.entity.Sale;
import com.roei_duenyas.smartstock.entity.Seller;
import com.roei_duenyas.smartstock.exception.ResourceNotFoundException;
import com.roei_duenyas.smartstock.repository.CustomerRepository;
import com.roei_duenyas.smartstock.repository.ProductVariantRepository;
import com.roei_duenyas.smartstock.repository.SaleRepository;
import com.roei_duenyas.smartstock.repository.SellerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * The stock bookkeeping around sales is the core business rule of the application:
 * selling removes stock, deleting a sale returns it, and overselling is impossible.
 */
@ExtendWith(MockitoExtension.class)
class SaleServiceImplTest {

    private static final long PRODUCT_ID = 1L;
    private static final long SELLER_ID = 7L;

    @Mock
    private SaleRepository saleRepository;
    @Mock
    private ProductVariantRepository productVariantRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private SellerRepository sellerRepository;

    @InjectMocks
    private SaleServiceImpl saleService;

    private ProductVariant largeShirt;
    private Seller seller;
    private Customer customer;

    @BeforeEach
    void setUp() {
        Product shirt = new Product();
        shirt.setId(PRODUCT_ID);
        shirt.setName("Black shirt");

        largeShirt = new ProductVariant();
        largeShirt.setId(10L);
        largeShirt.setSize("L");
        largeShirt.setQuantity(5);
        largeShirt.setProduct(shirt);

        seller = new Seller();
        seller.setId(SELLER_ID);
        seller.setName("Dana");

        customer = new Customer();
        customer.setId(3L);
        customer.setName("Noa");

        lenient().when(productVariantRepository.findByProductIdAndSize(PRODUCT_ID, "L")).thenReturn(Optional.of(largeShirt));
        lenient().when(sellerRepository.findById(SELLER_ID)).thenReturn(Optional.of(seller));
        lenient().when(customerRepository.findByNameIgnoreCase("Noa")).thenReturn(Optional.of(customer));
        lenient().when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> invocation.getArgument(0));
        lenient().when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void creatingASaleDeductsStock() {
        SaleDto result = saleService.createSale(request("L", "Noa", 2));

        assertEquals(3, largeShirt.getQuantity());
        assertEquals("Black shirt", result.getProductName());
        assertEquals("L", result.getProductSize());
        assertEquals("Noa", result.getCustomerName());
        assertEquals("Dana", result.getSellerName());
        assertEquals(2, result.getQuantity());
        verify(productVariantRepository).save(largeShirt);
    }

    @Test
    void sellingTheLastUnitsIsAllowed() {
        saleService.createSale(request("L", "Noa", 5));

        assertEquals(0, largeShirt.getQuantity());
    }

    @Test
    void sellingMoreThanInStockIsRejectedAndStockIsUntouched() {
        assertThrows(IllegalStateException.class, () -> saleService.createSale(request("L", "Noa", 6)));

        assertEquals(5, largeShirt.getQuantity());
        verify(saleRepository, never()).save(any(Sale.class));
    }

    @Test
    void unknownCustomerIsCreatedOnTheFly() {
        when(customerRepository.findByNameIgnoreCase("New customer")).thenReturn(Optional.empty());

        SaleDto result = saleService.createSale(request("L", "New customer", 1));

        assertEquals("New customer", result.getCustomerName());
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    void unknownVariantIsReported() {
        when(productVariantRepository.findByProductIdAndSize(PRODUCT_ID, "XS")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> saleService.createSale(request("XS", "Noa", 1)));
    }

    @Test
    void unknownSellerIsReported() {
        when(sellerRepository.findById(SELLER_ID)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> saleService.createSale(request("L", "Noa", 1)));
        assertEquals(5, largeShirt.getQuantity());
    }

    @Test
    void deletingASaleReturnsItsStock() {
        Sale sale = existingSale(2);
        when(saleRepository.findById(99L)).thenReturn(Optional.of(sale));

        saleService.deleteSale(99L);

        assertEquals(7, largeShirt.getQuantity());
        verify(saleRepository).delete(sale);
    }

    @Test
    void updatingASaleReturnsTheOldQuantityBeforeTakingTheNewOne() {
        Sale sale = existingSale(2); // 5 in stock after this sale was made
        when(saleRepository.findById(99L)).thenReturn(Optional.of(sale));

        saleService.updateSale(99L, request("L", "Noa", 4));

        // 5 + 2 returned - 4 sold
        assertEquals(3, largeShirt.getQuantity());
        assertEquals(4, sale.getQuantity());
    }

    @Test
    void updatingASaleBeyondAvailableStockLeavesEverythingAsItWas() {
        Sale sale = existingSale(2);
        when(saleRepository.findById(99L)).thenReturn(Optional.of(sale));

        // 5 in stock + 2 returned = 7 available, 8 requested
        assertThrows(IllegalStateException.class, () -> saleService.updateSale(99L, request("L", "Noa", 8)));

        assertEquals(5, largeShirt.getQuantity());
        assertEquals(2, sale.getQuantity());
    }

    private Sale existingSale(int quantity) {
        Sale sale = new Sale();
        sale.setId(99L);
        sale.setProductVariant(largeShirt);
        sale.setCustomer(customer);
        sale.setSeller(seller);
        sale.setQuantity(quantity);
        sale.setTotalPrice(new BigDecimal("100.00"));
        return sale;
    }

    private SaleCreateDto request(String size, String customerName, int quantity) {
        SaleCreateDto dto = new SaleCreateDto();
        dto.setProductId(PRODUCT_ID);
        dto.setSelectedSize(size);
        dto.setCustomerName(customerName);
        dto.setSellerId(SELLER_ID);
        dto.setQuantity(quantity);
        dto.setTotalPrice(new BigDecimal("100.00"));
        return dto;
    }
}
