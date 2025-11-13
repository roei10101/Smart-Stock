package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.dto.CustomerCreateDto;
import com.roei_duenyas.smartstock.dto.CustomerDto;
import com.roei_duenyas.smartstock.entity.Customer;
import com.roei_duenyas.smartstock.exception.ResourceNotFoundException;
import com.roei_duenyas.smartstock.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    @Transactional
    public CustomerDto createCustomer(CustomerCreateDto customerCreateDto) {
        // Check if customer with the same name already exists
        Optional<Customer> existingCustomer = customerRepository.findByNameIgnoreCase(customerCreateDto.getName());
        
        if (existingCustomer.isPresent()) {
            // If customer exists, return the existing customer
            return toDto(existingCustomer.get());
        } else {
            // If customer does not exist, create a new one
            Customer newCustomer = new Customer();
            newCustomer.setName(customerCreateDto.getName());
            // Assuming phone is not part of CustomerCreateDto for now, or can be added if needed
            // newCustomer.setPhone(customerCreateDto.getPhone()); 

            Customer savedCustomer = customerRepository.save(newCustomer);
            return toDto(savedCustomer);
        }
    }

    @Override
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerDto getCustomerById(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        return toDto(customer);
    }

    @Override
    @Transactional
    public CustomerDto updateCustomer(Long customerId, CustomerDto customerDto) {
        Customer existingCustomer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        existingCustomer.setName(customerDto.getName());
        existingCustomer.setPhone(customerDto.getPhone()); // Assuming phone is part of CustomerDto

        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return toDto(updatedCustomer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        customerRepository.delete(customer);
    }

    private CustomerDto toDto(Customer customer) {
        CustomerDto dto = new CustomerDto();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setPhone(customer.getPhone());
        return dto;
    }
}