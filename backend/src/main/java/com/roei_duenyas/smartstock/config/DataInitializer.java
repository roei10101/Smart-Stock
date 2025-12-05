package com.roei_duenyas.smartstock.config;

import com.roei_duenyas.smartstock.entity.Role;
import com.roei_duenyas.smartstock.entity.User;
import com.roei_duenyas.smartstock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("demo").isEmpty()) {
            User demoUser = User.builder()
                    .username("demo")
                    .password(passwordEncoder.encode("demo"))
                    .role(Role.USER)
                    .build();
            userRepository.save(demoUser);
            System.out.println("Demo user created: username=demo, password=demo");
        }
    }
}
