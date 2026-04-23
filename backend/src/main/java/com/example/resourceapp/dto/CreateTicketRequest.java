package com.example.resourceapp.dto;

import com.example.resourceapp.model.TicketCategory;
import com.example.resourceapp.model.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateTicketRequest {

    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    @NotBlank(message = "Preferred contact details are required")
    private String preferredContactDetails;

    private List<String> imageDataList; // Base64 encoded images

    // Constructors
    public CreateTicketRequest() {}

    public CreateTicketRequest(String resourceId, String location, TicketCategory category, 
                              String description, TicketPriority priority, 
                              String preferredContactDetails, List<String> imageDataList) {
        this.resourceId = resourceId;
        this.location = location;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.preferredContactDetails = preferredContactDetails;
        this.imageDataList = imageDataList;
    }

    // Getters and Setters
    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public TicketCategory getCategory() {
        return category;
    }

    public void setCategory(TicketCategory category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public String getPreferredContactDetails() {
        return preferredContactDetails;
    }

    public void setPreferredContactDetails(String preferredContactDetails) {
        this.preferredContactDetails = preferredContactDetails;
    }

    public List<String> getImageDataList() {
        return imageDataList;
    }

    public void setImageDataList(List<String> imageDataList) {
        this.imageDataList = imageDataList;
    }
}
