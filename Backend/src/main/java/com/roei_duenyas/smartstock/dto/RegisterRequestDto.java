package com.roei_duenyas.smartstock.dto;

import com.roei_duenyas.smartstock.entity.Role;
import jakarta.validation.constraints.NotBlank; // Added import
import lombok.*;

@Getter
@Setter
public class RegisterRequestDto {
    @NotBlank(message = "Username cannot be empty") // Added validation
    private String username;
    @NotBlank(message = "Password cannot be empty") // Added validation
    private String password;
    private Role role;
}