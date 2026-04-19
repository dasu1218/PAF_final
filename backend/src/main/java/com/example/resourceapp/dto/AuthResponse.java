package com.example.resourceapp.dto;

public class AuthResponse {

    private String id;
    private String name;
    private String email;
    private String message;

    public AuthResponse(String id, String name, String email, String message) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.message = message;
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
}