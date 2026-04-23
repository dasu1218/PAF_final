package com.example.resourceapp.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateTicketStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String resolutionNotes;

    private String rejectionReason;

    // Constructor
    public UpdateTicketStatusRequest() {}

    public UpdateTicketStatusRequest(String status, String resolutionNotes, String rejectionReason) {
        this.status = status;
        this.resolutionNotes = resolutionNotes;
        this.rejectionReason = rejectionReason;
    }

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
