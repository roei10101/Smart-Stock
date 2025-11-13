package com.roei_duenyas.smartstock.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    @Order(1) // This chain is evaluated first
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/auth/**") // Apply this chain ONLY to auth paths
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Allow all requests to /api/auth/**
                );
        return http.build();
    }

    @Bean
    @Order(2) // This chain is evaluated second
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**") // Apply this chain to all other API paths
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth
                        // User-specific permissions
                        .requestMatchers(HttpMethod.POST, "/api/sales").hasAnyAuthority("USER", "ADMIN")
                        // Allow USER and ADMIN to create customers (for automatic creation during sale)
                        .requestMatchers(HttpMethod.POST, "/api/customers").hasAnyAuthority("USER", "ADMIN")
                        // Allow USER and ADMIN to create sellers
                        .requestMatchers(HttpMethod.POST, "/api/sellers").hasAnyAuthority("USER", "ADMIN")

                        // Admin-specific permissions for other POST/PUT/DELETE operations
                        .requestMatchers(HttpMethod.POST, "/api/products").hasAuthority("ADMIN") // Products still admin only
                        .requestMatchers(HttpMethod.PUT, "/api/sales/**", "/api/products/**", "/api/customers/**", "/api/sellers/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/sales/**", "/api/products/**", "/api/customers/**", "/api/sellers/**").hasAuthority("ADMIN")
                        
                        // All other API endpoints require authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // JWT filter is ONLY in this chain

        return http.build();
    }
}