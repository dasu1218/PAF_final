package com.example.resourceapp.service;

import com.example.resourceapp.dto.*;
import com.example.resourceapp.model.*;
import com.example.resourceapp.repository.TicketRepository;
import com.example.resourceapp.exception.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    @Autowired
    public TicketService(TicketRepository ticketRepository, NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.notificationService = notificationService;
    }

    /**
     * Create a new incident ticket
     */
    public TicketResponse createTicket(CreateTicketRequest request, String userId, String userName) {
        Ticket ticket = new Ticket();
        ticket.setResourceId(request.getResourceId());
        ticket.setLocation(request.getLocation());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContactDetails(request.getPreferredContactDetails());
        ticket.setCreatedByUserId(userId);
        ticket.setCreatedByUserName(userName);
        ticket.setStatus(TicketStatus.OPEN);

        // Process image attachments (max 3)
        if (request.getImageDataList() != null && !request.getImageDataList().isEmpty()) {
            List<String> images = request.getImageDataList();
            int maxImages = Math.min(images.size(), 3);
            for (int i = 0; i < maxImages; i++) {
                ImageAttachment attachment = new ImageAttachment();
                attachment.setId(UUID.randomUUID().toString());
                attachment.setFileName("attachment_" + (i + 1) + ".jpg");
                attachment.setFileType("image/jpeg");
                attachment.setFileData(images.get(i));
                attachment.setFileSize(images.get(i).length());
                attachment.setUploadedAt(LocalDateTime.now());
                ticket.addImageAttachment(attachment);
            }
        }

        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);
        return convertToResponse(savedTicket);
    }

    /**
     * Get all tickets (admin only)
     */
    public List<TicketResponse> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAll();
        return tickets.stream().map(this::convertToResponse).toList();
    }

    /**
     * Get tickets by status
     */
    public List<TicketResponse> getTicketsByStatus(TicketStatus status) {
        List<Ticket> tickets = ticketRepository.findByStatus(status);
        return tickets.stream().map(this::convertToResponse).toList();
    }

    /**
     * Get tickets by resource ID
     */
    public List<TicketResponse> getTicketsByResourceId(String resourceId) {
        List<Ticket> tickets = ticketRepository.findByResourceId(resourceId);
        return tickets.stream().map(this::convertToResponse).toList();
    }

    /**
     * Get user's tickets (created by the user)
     */
    public List<TicketResponse> getUserTickets(String userId) {
        List<Ticket> tickets = ticketRepository.findByCreatedByUserId(userId);
        return tickets.stream().map(this::convertToResponse).toList();
    }

    /**
     * Get tickets assigned to a technician
     */
    public List<TicketResponse> getAssignedTickets(String technicianId) {
        List<Ticket> tickets = ticketRepository.findByAssignedToUserId(technicianId);
        return tickets.stream().map(this::convertToResponse).toList();
    }

    /**
     * Get ticket by ID
     */
    public TicketResponse getTicketById(String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with ID: " + ticketId));
        return convertToResponse(ticket);
    }

    /**
     * Assign ticket to a technician
     */
    public TicketResponse assignTicket(String ticketId, AssignTicketRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with ID: " + ticketId));

        ticket.setAssignedToUserId(request.getTechnicianId());
        ticket.setAssignedToUserName(request.getTechnicianName());
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket updatedTicket = ticketRepository.save(ticket);

        // Notify technician
        notificationService.createNotification(
            ticket.getAssignedToUserId(),
            "A new ticket (" + ticket.getId() + ") has been assigned to you.",
            "TICKET",
            ticket.getId()
        );

        return convertToResponse(updatedTicket);
    }

    /**
     * Update ticket status with workflow validation
     * Valid transitions:
     * OPEN -> IN_PROGRESS, REJECTED
     * IN_PROGRESS -> RESOLVED, REJECTED
     * RESOLVED -> CLOSED
     * CLOSED, REJECTED -> (no transitions)
     */
    public TicketResponse updateTicketStatus(String ticketId, UpdateTicketStatusRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with ID: " + ticketId));

        TicketStatus newStatus;
        try {
            newStatus = TicketStatus.valueOf(request.getStatus());
        } catch (IllegalArgumentException e) {
            throw new InvalidTicketStatusException("Invalid status: " + request.getStatus());
        }

        // Validate workflow
        TicketStatus currentStatus = ticket.getStatus();
        validateStatusTransition(currentStatus, newStatus);

        ticket.setStatus(newStatus);

        if (newStatus == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
            if (request.getResolutionNotes() != null) {
                ticket.setResolutionNotes(request.getResolutionNotes());
            }
        } else if (newStatus == TicketStatus.CLOSED) {
            ticket.setClosedAt(LocalDateTime.now());
        } else if (newStatus == TicketStatus.REJECTED) {
            if (request.getRejectionReason() != null) {
                ticket.setRejectionReason(request.getRejectionReason());
            }
        }

        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket updatedTicket = ticketRepository.save(ticket);

        // Notify creator
        notificationService.createNotification(
            ticket.getCreatedByUserId(),
            "The status of your ticket (" + ticket.getId() + ") has changed to " + newStatus + ".",
            "TICKET",
            ticket.getId()
        );

        return convertToResponse(updatedTicket);
    }

    /**
     * Validate workflow transitions
     */
    private void validateStatusTransition(TicketStatus currentStatus, TicketStatus newStatus) {
        boolean isValidTransition = switch (currentStatus) {
            case OPEN -> newStatus == TicketStatus.IN_PROGRESS || newStatus == TicketStatus.REJECTED;
            case IN_PROGRESS -> newStatus == TicketStatus.RESOLVED || newStatus == TicketStatus.REJECTED;
            case RESOLVED -> newStatus == TicketStatus.CLOSED;
            case CLOSED, REJECTED -> false;
        };

        if (!isValidTransition) {
            throw new InvalidTicketStatusException(
                    "Cannot transition from " + currentStatus + " to " + newStatus
            );
        }
    }

    /**
     * Add a comment to a ticket
     */
    public TicketResponse addComment(String ticketId, String userId, String userName, AddCommentRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with ID: " + ticketId));

        TicketComment comment = new TicketComment();
        comment.setId(UUID.randomUUID().toString());
        comment.setUserId(userId);
        comment.setUserName(userName);
        comment.setContent(request.getContent());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        ticket.addComment(comment);
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket updatedTicket = ticketRepository.save(ticket);

        // Notify relevant parties
        // If creator commented, notify technician (if assigned)
        // If someone else commented, notify creator
        if (!ticket.getCreatedByUserId().equals(userId)) {
            notificationService.createNotification(
                ticket.getCreatedByUserId(),
                "A new comment was added to your ticket (" + ticket.getId() + ") by " + userName + ".",
                "COMMENT",
                ticket.getId()
            );
        } else if (ticket.getAssignedToUserId() != null) {
            notificationService.createNotification(
                ticket.getAssignedToUserId(),
                "The creator of ticket (" + ticket.getId() + ") has added a new comment.",
                "COMMENT",
                ticket.getId()
            );
        }

        return convertToResponse(updatedTicket);
    }

    /**
     * Edit a comment (only by comment owner)
     */
    public TicketResponse editComment(String ticketId, String commentId, String userId, AddCommentRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with ID: " + ticketId));

        TicketComment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new CommentNotFoundException("Comment not found with ID: " + commentId));

        // Check ownership
        if (!comment.getUserId().equals(userId)) {
            throw new AuthenticationFailedException("You can only edit your own comments");
        }

        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToResponse(updatedTicket);
    }

    /**
     * Delete a comment (only by comment owner or admin)
     */
    public TicketResponse deleteComment(String ticketId, String commentId, String userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with ID: " + ticketId));

        TicketComment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new CommentNotFoundException("Comment not found with ID: " + commentId));

        // Check ownership
        if (!comment.getUserId().equals(userId)) {
            throw new AuthenticationFailedException("You can only delete your own comments");
        }

        ticket.getComments().remove(comment);
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToResponse(updatedTicket);
    }

    /**
     * Helper method to convert Ticket to TicketResponse
     */
    private TicketResponse convertToResponse(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getResourceId(),
                ticket.getLocation(),
                ticket.getCreatedByUserId(),
                ticket.getCreatedByUserName(),
                ticket.getCategory(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getPreferredContactDetails(),
                ticket.getStatus(),
                ticket.getAssignedToUserId(),
                ticket.getAssignedToUserName(),
                ticket.getRejectionReason(),
                ticket.getResolutionNotes(),
                ticket.getImageAttachments(),
                ticket.getComments(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                ticket.getResolvedAt(),
                ticket.getClosedAt()
        );
    }
}
