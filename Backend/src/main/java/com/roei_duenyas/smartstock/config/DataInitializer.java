package com.roei_duenyas.smartstock.config;

import com.roei_duenyas.smartstock.entity.Role;
import com.roei_duenyas.smartstock.entity.User;
import com.roei_duenyas.smartstock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeAdminUser() {
        return args -> {
            // Check if the admin user already exists
            if (userRepository.findByUsername("admin").isEmpty()) {
                // Create the new admin user
                User adminUser = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .role(Role.ADMIN)
                        .build();
                
                // Save the user to the database
                userRepository.save(adminUser);
                System.out.println("Admin user created successfully!");
            }
        };
    }
}
