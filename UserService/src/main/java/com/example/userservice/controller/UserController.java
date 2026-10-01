package com.example.userservice.controller;


import com.example.userservice.dto.*;
import com.example.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user-service")
public class UserController {

    private final UserService userService;

    @GetMapping("/user/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        UserResponse body = userService.getUser(id);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        List<UserResponse> body = userService.getUsers();
        return ResponseEntity.ok(body);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest userRequest) {
        UserResponse body = userService.createUser(userRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse body = userService.authenticateUser(loginRequest);
        return ResponseEntity.ok(body);
    }

    @PutMapping("/user")
    public ResponseEntity<UserResponse> updateUser(@RequestHeader("X-User-Email") String email, @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        UserResponse body = userService.updateUser(userUpdateRequest,email);
        return ResponseEntity.ok(body);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@RequestHeader("X-User-Email") String email, @PathVariable Long id) {
        String body = userService.deleteUser(id,email);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/.well-known/jwks.json")
    public Map<String, Object> getJwks() {
        return userService.getJwks();
    }
}
