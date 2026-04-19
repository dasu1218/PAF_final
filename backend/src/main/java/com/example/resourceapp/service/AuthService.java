package com.example.resourceapp.service;

import com.example.resourceapp.dto.AuthRequest;
import com.example.resourceapp.dto.AuthResponse;
import com.example.resourceapp.dto.SignupRequest;
import com.example.resourceapp.exception.AuthenticationFailedException;
import com.example.resourceapp.model.User;
import com.example.resourceapp.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public AuthResponse signup(SignupRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            throw new IllegalArgumentException("An account with this email already exists");
        });

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        return new AuthResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), "Signup successful");
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new AuthenticationFailedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthenticationFailedException("Invalid email or password");
        }

        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), "Login successful");
    }
}