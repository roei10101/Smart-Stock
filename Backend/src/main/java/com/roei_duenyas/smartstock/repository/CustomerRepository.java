package com.roei_duenyas.smartstock.repository;

import com.roei_duenyas.smartstock.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // מתודה חדשה למציאת לקוח לפי שם מדויק (לא תלוי רישיות)
    Optional<Customer> findByNameIgnoreCase(String name);
}