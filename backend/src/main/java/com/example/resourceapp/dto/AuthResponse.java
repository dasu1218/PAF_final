package com.example.resourceapp.dto;

public class AuthResponse {

    private String id;
    private String name;
    private String email;
    private String message;
    private String role;

    public AuthResponse(String id, String name, String email, String message) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.message = message;
        this.role = "USER"; // Default role
    }

    public AuthResponse(String id, String name, String email, String message, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.message = message;
        this.role = role != null ? role : "USER";
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}