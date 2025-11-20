package com.roei_duenyas.smartstock.service;

import com.roei_duenyas.smartstock.config.JwtService;
import com.roei_duenyas.smartstock.dto.AuthRequestDto;
import com.roei_duenyas.smartstock.dto.AuthResponseDto;
import com.roei_duenyas.smartstock.dto.RegisterRequestDto;
import com.roei_duenyas.smartstock.entity.Role;
import com.roei_duenyas.smartstock.entity.User;
import com.roei_duenyas.smartstock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDto register(RegisterRequestDto request) {
        var user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER); // Default to USER
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return new AuthResponseDto(jwtToken);
    }

    public AuthResponseDto authenticate(AuthRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = repository.findByUsername(request.getUsername())
                .orElseThrow(); // User must exist at this point
        var jwtToken = jwtService.generateToken(user);
        return new AuthResponseDto(jwtToken);
    }
}