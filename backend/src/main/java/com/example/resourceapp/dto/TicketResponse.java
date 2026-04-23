package com.example.resourceapp.dto;

import com.example.resourceapp.model.TicketCategory;
import com.example.resourceapp.model.TicketPriority;
import com.example.resourceapp.model.TicketStatus;
import com.example.resourceapp.model.ImageAttachment;
import com.example.resourceapp.model.TicketComment;
import java.time.LocalDateTime;
import java.util.List;

public class TicketResponse {

    private String id;
    private String resourceId;
    private String location;
    private String createdByUserId;
    private String createdByUserName;
    private TicketCategory category;
    private String description;
    private TicketPriority priority;
    private String preferredContactDetails;
    private TicketStatus status;
    private String assignedToUserId;
    private String assignedToUserName;
    private String rejectionReason;
    private String resolutionNotes;
    private List<ImageAttachment> imageAttachments;
    private List<TicketComment> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    // Constructors
    public TicketResponse() {}

    public TicketResponse(String id, String resourceId, String location, String createdByUserId,
                         String createdByUserName, TicketCategory category, String description,
                         TicketPriority priority, String preferredContactDetails, TicketStatus status,
                         String assignedToUserId, String assignedToUserName, String rejectionReason,
                         String resolutionNotes, List<ImageAttachment> imageAttachments,
                         List<TicketComment> comments, LocalDateTime createdAt, LocalDateTime updatedAt,
                         LocalDateTime resolvedAt, LocalDateTime closedAt) {
        this.id = id;
        this.resourceId = resourceId;
        this.location = location;
        this.createdByUserId = createdByUserId;
        this.createdByUserName = createdByUserName;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.preferredContactDetails = preferredContactDetails;
        this.status = status;
        this.assignedToUserId = assignedToUserId;
        this.assignedToUserName = assignedToUserName;
        this.rejectionReason = rejectionReason;
        this.resolutionNotes = resolutionNotes;
        this.imageAttachments = imageAttachments;
        this.comments = comments;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
        this.closedAt = closedAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public String getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(String createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public String getCreatedByUserName() {
        return createdByUserName;
    }

    public void setCreatedByUserName(String createdByUserName) {
        this.createdByUserName = createdByUserName;
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

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getAssignedToUserId() {
        return assignedToUserId;
    }

    public void setAssignedToUserId(String assignedToUserId) {
        this.assignedToUserId = assignedToUserId;
    }

    public String getAssignedToUserName() {
        return assignedToUserName;
    }

    public void setAssignedToUserName(String assignedToUserName) {
        this.assignedToUserName = assignedToUserName;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public List<ImageAttachment> getImageAttachments() {
        return imageAttachments;
    }

    public void setImageAttachments(List<ImageAttachment> imageAttachments) {
        this.imageAttachments = imageAttachments;
    }

    public List<TicketComment> getComments() {
        return comments;
    }

    public void setComments(List<TicketComment> comments) {
        this.comments = comments;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }
}
