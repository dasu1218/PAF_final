package com.example.resourceapp.controller;

import com.example.resourceapp.dto.AuthRequest;
import com.example.resourceapp.dto.AuthResponse;
import com.example.resourceapp.dto.SignupRequest;
import com.example.resourceapp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return new ResponseEntity<>(authService.signup(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return new ResponseEntity<>(authService.login(request), HttpStatus.OK);
    }

    @GetMapping("/oauth-success")
    public ResponseEntity<Void> oauthSuccess(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "http://localhost:5173/login?error=unauthorized")
                .build();
        }
        
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String googleId = principal.getAttribute("sub");
        
        AuthResponse response = authService.loginOrSignupOAuth(email, name, googleId);
        
        // Encode user data to Base64 for the URL
        String userData = String.format("{\"id\":\"%s\",\"name\":\"%s\",\"email\":\"%s\",\"role\":\"%s\"}", 
            response.getId(), response.getName(), response.getEmail(), response.getRole());
        String encodedUser = java.util.Base64.getEncoder().encodeToString(userData.getBytes());
        
        return ResponseEntity.status(HttpStatus.FOUND)
            .header("Location", "http://localhost:5173/?user=" + encodedUser)
            .build();
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@AuthenticationPrincipal Object principal) {
        // This is a simplified version. In a real app, you'd extract user info from the principal.
        return new ResponseEntity<>(HttpStatus.OK);
    }
}