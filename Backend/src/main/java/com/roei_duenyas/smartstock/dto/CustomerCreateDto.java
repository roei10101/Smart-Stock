package com.roei_duenyas.smartstock.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerCreateDto {
    @NotBlank(message = "Customer name cannot be empty")
    private String name;
}