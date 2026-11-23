package com.roei_duenyas.smartstock.exception;

import com.roei_duenyas.smartstock.controller.SaleController;
import com.roei_duenyas.smartstock.dto.SaleCreateDto;
import com.roei_duenyas.smartstock.service.SaleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GlobalExceptionHandlerTest {

    private static final String VALID_SALE = """
            {"productId": 1, "selectedSize": "L", "customerName": "Noa", "sellerId": 7, "quantity": 9, "totalPrice": 100}
            """;

    private SaleService saleService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        saleService = mock(SaleService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new SaleController(saleService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void businessRuleViolationsBecome409WithTheMessage() throws Exception {
        when(saleService.createSale(any(SaleCreateDto.class)))
                .thenThrow(new IllegalStateException("Not enough stock for: Black shirt size: L"));

        mockMvc.perform(post("/api/sales").contentType(MediaType.APPLICATION_JSON).content(VALID_SALE))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Not enough stock for: Black shirt size: L"));
    }

    @Test
    void missingResourcesBecome404WithTheMessage() throws Exception {
        when(saleService.getSaleById(42L)).thenThrow(new ResourceNotFoundException("Sale not found with id: 42"));

        mockMvc.perform(get("/api/sales/42"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Sale not found with id: 42"));
    }

    @Test
    void invalidRequestBodiesBecome400NamingTheProblem() throws Exception {
        mockMvc.perform(post("/api/sales").contentType(MediaType.APPLICATION_JSON).content("{\"quantity\": 1}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Product ID cannot be null")));
    }
}
