package com.example.userservice.service;

import com.example.userservice.dto.*;
import com.example.userservice.exception.AuthenticationFailedException;
import com.example.userservice.exception.DuplicateEmailException;
import com.example.userservice.exception.UserNotFoundException;
import com.example.userservice.model.User;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.utils.JwtUtils;
import com.example.userservice.utils.KeyGeneratorUtils;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.interfaces.RSAPublicKey;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final KeyGeneratorUtils keyGeneratorUtils;
    private final AuthenticationManager authenticationManager;

    public UserResponse createUser(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new DuplicateEmailException(userRequest.getEmail() + " already exist");
        }
        User user = User.builder()
                .name(userRequest.getName())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .city(userRequest.getCity())
                .phone(userRequest.getPhone())
                .role("USER")
                .build();
        userRepository.save(user);
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .city(user.getCity())
                .role(user.getRole())
                .phone(user.getPhone())
                .build();
    }

    public UserResponse updateUser(UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findByIdAndEmail(userUpdateRequest.getId(),userUpdateRequest.getEmail()).orElseThrow(
                () -> new UserNotFoundException(userUpdateRequest.getId() + " not exist"));
        user.setName(userUpdateRequest.getName());
        user.setCity(userUpdateRequest.getCity());
        user.setPhone(userUpdateRequest.getPhone());
        userRepository.save(user);
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .city(user.getCity())
                .role(user.getRole())
                .phone(user.getPhone())
                .build();
    }

    public UserResponse getUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException("User " + id + " not exist")
        );
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .city(user.getCity())
                .role(user.getRole())
                .phone(user.getPhone())
                .build();
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(u -> UserResponse
                        .builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .city(u.getCity())
                        .role(u.getRole())
                        .phone(u.getPhone())
                        .build())
                .toList();
    }

    public String deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User " + id + " not exist");
        }
        userRepository.deleteById(id);
        return "User " + id + " deleted successfully";
    }

    public LoginResponse authenticateUser(LoginRequest loginRequest) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new AuthenticationFailedException("Invalid credentials", e);
        }

        User user = userRepository
                .findByEmail(loginRequest.getEmail())
                .orElseThrow(UserNotFoundException::new);

        String token = jwtUtils.generateJwt(
                user.getEmail(),
                user.getRole()
        );

        return LoginResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .city(user.getCity())
                .role(user.getRole())
                .phone(user.getPhone())
                .jwt(token)
                .build();
    }

    public Map<String, Object> getJwks() {
        RSAPublicKey publicKey = (RSAPublicKey) keyGeneratorUtils.getKeyPair().getPublic();
        RSAKey rsaKey = new RSAKey.Builder(publicKey)
                .keyID("access-token")
                .build();
        return new JWKSet(rsaKey).toJSONObject();
    }
}
