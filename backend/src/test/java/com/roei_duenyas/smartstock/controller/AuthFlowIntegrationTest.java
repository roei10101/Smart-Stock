package com.roei_duenyas.smartstock.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.roei_duenyas.smartstock.entity.Role;
import com.roei_duenyas.smartstock.entity.User;
import com.roei_duenyas.smartstock.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * End-to-end checks of the security setup: real filter chain, real JWTs, in-memory database.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthFlowIntegrationTest {

    private static final String PROTECTED_ENDPOINT = "/api/products";

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanUsers() {
        userRepository.deleteAll();
    }

    @Test
    void protectedEndpointsRequireAuthentication() throws Exception {
        mockMvc.perform(get(PROTECTED_ENDPOINT)).andExpect(status().isUnauthorized());
    }

    @Test
    void healthEndpointIsPublic() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void registerThenLoginThenCallTheApi() throws Exception {
        register("alice", "correct-horse", null).andExpect(status().isOk());

        String token = login("alice", "correct-horse");

        mockMvc.perform(get(PROTECTED_ENDPOINT).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void passwordsAreStoredHashed() throws Exception {
        register("alice", "correct-horse", null).andExpect(status().isOk());

        User stored = userRepository.findByUsername("alice").orElseThrow();
        assertNotEquals("correct-horse", stored.getPassword());
    }

    @Test
    void loginWithWrongPasswordIsRejected() throws Exception {
        register("alice", "correct-horse", null).andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("username", "alice", "password", "wrong"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void registrationCannotGrantAdmin() throws Exception {
        register("mallory", "pw-123456", "ADMIN").andExpect(status().isOk());

        User stored = userRepository.findByUsername("mallory").orElseThrow();
        assertEquals(Role.USER, stored.getRole());
    }

    @Test
    void duplicateUsernameIsRejected() throws Exception {
        register("alice", "correct-horse", null).andExpect(status().isOk());

        register("alice", "another-password", null).andExpect(status().isConflict());
    }

    @Test
    void blankCredentialsAreRejected() throws Exception {
        register("", "", null).andExpect(status().isBadRequest());
    }

    @Test
    void malformedTokenIsRejectedWithoutCrashing() throws Exception {
        mockMvc.perform(get(PROTECTED_ENDPOINT).header("Authorization", "Bearer not-a-jwt"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenOfADeletedUserStopsWorking() throws Exception {
        register("alice", "correct-horse", null).andExpect(status().isOk());
        String token = login("alice", "correct-horse");

        userRepository.deleteAll();

        mockMvc.perform(get(PROTECTED_ENDPOINT).header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    private org.springframework.test.web.servlet.ResultActions register(String username, String password, String role) throws Exception {
        Map<String, String> body = role == null
                ? Map.of("username", username, "password", password)
                : Map.of("username", username, "password", password, "role", role);
        return mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json(body)));
    }

    private String login(String username, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("username", username, "password", password))))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    private String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }
}
