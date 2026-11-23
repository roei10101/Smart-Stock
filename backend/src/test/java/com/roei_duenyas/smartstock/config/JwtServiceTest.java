package com.roei_duenyas.smartstock.config;

import com.roei_duenyas.smartstock.entity.Role;
import com.roei_duenyas.smartstock.entity.User;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private static final String KEY = base64("unit-test-signing-key-that-is-long-enough-for-hs256");
    private static final String OTHER_KEY = base64("a-completely-different-key-used-by-an-attacker-0000");

    private JwtService jwtService;
    private User alice;

    @BeforeEach
    void setUp() {
        jwtService = serviceWithKey(KEY);
        alice = User.builder().username("alice").password("x").role(Role.USER).build();
    }

    @Test
    void generatedTokenCarriesTheUsername() {
        String token = jwtService.generateToken(alice);

        assertEquals("alice", jwtService.extractUsername(token));
    }

    @Test
    void tokenIsValidForItsOwner() {
        String token = jwtService.generateToken(alice);

        assertTrue(jwtService.isTokenValid(token, alice));
    }

    @Test
    void tokenIsNotValidForAnotherUser() {
        User bob = User.builder().username("bob").password("x").role(Role.USER).build();
        String token = jwtService.generateToken(alice);

        assertFalse(jwtService.isTokenValid(token, bob));
    }

    @Test
    void tokenSignedWithAnotherKeyIsRejected() {
        String forged = serviceWithKey(OTHER_KEY).generateToken(alice);

        assertThrows(JwtException.class, () -> jwtService.extractUsername(forged));
    }

    @Test
    void tamperedTokenIsRejected() {
        String token = jwtService.generateToken(alice);
        // Flip the first character of the signature part
        int signatureStart = token.lastIndexOf('.') + 1;
        char replacement = token.charAt(signatureStart) == 'A' ? 'B' : 'A';
        String tampered = token.substring(0, signatureStart) + replacement + token.substring(signatureStart + 1);

        assertThrows(JwtException.class, () -> jwtService.extractUsername(tampered));
    }

    @Test
    void garbageIsRejected() {
        assertThrows(JwtException.class, () -> jwtService.extractUsername("not-a-jwt"));
    }

    private static JwtService serviceWithKey(String key) {
        JwtService service = new JwtService();
        ReflectionTestUtils.setField(service, "SECRET_KEY", key);
        return service;
    }

    private static String base64(String value) {
        return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }
}
