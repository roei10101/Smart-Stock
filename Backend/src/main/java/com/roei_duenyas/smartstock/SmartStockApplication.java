package com.roei_duenyas.smartstock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.roei_duenyas.smartstock") // Ensure all components are scanned
public class SmartStockApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartStockApplication.class, args);
    }

}
