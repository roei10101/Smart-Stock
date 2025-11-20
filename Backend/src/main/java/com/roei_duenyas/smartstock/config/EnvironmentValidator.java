package com.roei_duenyas.smartstock.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvironmentValidator {

    private static final Logger logger = LoggerFactory.getLogger(EnvironmentValidator.class);

    @Value("${DB_URL:}")
    private String dbUrl;

    @Value("${DB_USERNAME:}")
    private String dbUsername;

    @Value("${DB_PASSWORD:}")
    private String dbPassword;

    @Value("${JWT_SECRET_KEY:}")
    private String jwtSecretKey;

    @Bean
    public CommandLineRunner validateEnvironmentVariables() {
        return args -> {
            boolean missingVar = false;
            if (dbUrl == null || dbUrl.trim().isEmpty()) {
                logger.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                logger.error("!!! CRITICAL ERROR: Environment variable 'DB_URL' is not set. !!!");
                logger.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                missingVar = true;
            }
            if (dbUsername == null || dbUsername.trim().isEmpty()) {
                logger.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                logger.error("!!! CRITICAL ERROR: Environment variable 'DB_USERNAME' is not set. !!!");
                logger.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                missingVar = true;
            }
            if (dbPassword == null || dbPassword.trim().isEmpty()) {
                logger.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                logger.error("!!! CRITICAL ERROR: Environment variable 'DB_PASSWORD' is not set. !!!");
                logger.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                missingVar = true;
            }
            if (jwtSecretKey == null || jwtSecretKey.trim().isEmpty()) {
                logger.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                logger.error("!!! CRITICAL ERROR: Environment variable 'JWT_SECRET_KEY' is not set. !!!");
                logger.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                missingVar = true;
            }

            if (missingVar) {
                logger.error("Application startup failed due to missing environment variables. Shutting down.");
                System.exit(1);
            } else {
                logger.info("All required environment variables are present.");
            }
        };
    }
}