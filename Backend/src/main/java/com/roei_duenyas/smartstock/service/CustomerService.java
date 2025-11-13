package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.CustomerCreateDto;
import com.roei_duenyas.smartstock.dto.CustomerDto;

import java.util.List;

public interface CustomerService {
    CustomerDto createCustomer(CustomerCreateDto customerCreateDto);
    List<CustomerDto> getAllCustomers();
    CustomerDto getCustomerById(Long customerId);
    CustomerDto updateCustomer(Long customerId, CustomerDto customerDto);
    void deleteCustomer(Long customerId);
}