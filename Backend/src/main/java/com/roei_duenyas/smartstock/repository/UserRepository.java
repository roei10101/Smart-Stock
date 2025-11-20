package com.roei_duenyas.smartstock.repository;

import com.roei_duenyas.smartstock.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // מתודה למציאת משתמש לפי שם משתמש
    Optional<User> findByUsername(String username);
}