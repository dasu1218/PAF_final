package com.example.resourceapp.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignTicketRequest {

    @NotBlank(message = "Technician ID is required")
    private String technicianId;

    @NotBlank(message = "Technician name is required")
    private String technicianName;

    // Constructor
    public AssignTicketRequest() {}

    public AssignTicketRequest(String technicianId, String technicianName) {
        this.technicianId = technicianId;
        this.technicianName = technicianName;
    }

    // Getters and Setters
    public String getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }

    public String getTechnicianName() {
        return technicianName;
    }

    public void setTechnicianName(String technicianName) {
        this.technicianName = technicianName;
    }
}
