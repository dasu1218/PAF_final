package com.example.resourceapp.controller;

import com.example.resourceapp.dto.*;
import com.example.resourceapp.model.TicketStatus;
import com.example.resourceapp.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /**
     * Create a new incident ticket
     * POST /api/tickets
     */
    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Name", required = false) String userName) {

        if (userId == null || userId.isEmpty() || userName == null || userName.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TicketResponse ticketResponse = ticketService.createTicket(request, userId, userName);
        return new ResponseEntity<>(ticketResponse, HttpStatus.CREATED);
    }

    /**
     * Get all tickets (admin only)
     * GET /api/tickets
     */
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        List<TicketResponse> tickets = ticketService.getAllTickets();
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    /**
     * Get tickets by status
     * GET /api/tickets/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TicketResponse>> getTicketsByStatus(@PathVariable String status) {
        try {
            TicketStatus ticketStatus = TicketStatus.valueOf(status);
            List<TicketResponse> tickets = ticketService.getTicketsByStatus(ticketStatus);
            return new ResponseEntity<>(tickets, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get tickets by resource ID
     * GET /api/tickets/resource/{resourceId}
     */
    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<List<TicketResponse>> getTicketsByResourceId(@PathVariable String resourceId) {
        List<TicketResponse> tickets = ticketService.getTicketsByResourceId(resourceId);
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    /**
     * Get user's tickets (created by the user)
     * GET /api/tickets/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketResponse>> getUserTickets(@PathVariable String userId) {
        List<TicketResponse> tickets = ticketService.getUserTickets(userId);
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    /**
     * Get tickets assigned to a technician
     * GET /api/tickets/assigned/{technicianId}
     */
    @GetMapping("/assigned/{technicianId}")
    public ResponseEntity<List<TicketResponse>> getAssignedTickets(@PathVariable String technicianId) {
        List<TicketResponse> tickets = ticketService.getAssignedTickets(technicianId);
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    /**
     * Get ticket by ID
     * GET /api/tickets/{ticketId}
     */
    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable String ticketId) {
        TicketResponse ticket = ticketService.getTicketById(ticketId);
        return new ResponseEntity<>(ticket, HttpStatus.OK);
    }

    /**
     * Assign ticket to a technician
     * PUT /api/tickets/{ticketId}/assign
     */
    @PutMapping("/{ticketId}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> assignTicket(
            @PathVariable String ticketId,
            @Valid @RequestBody AssignTicketRequest request) {
        TicketResponse ticketResponse = ticketService.assignTicket(ticketId, request);
        return new ResponseEntity<>(ticketResponse, HttpStatus.OK);
    }

    /**
     * Update ticket status
     * PUT /api/tickets/{ticketId}/status
     */
    @PutMapping("/{ticketId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable String ticketId,
            @Valid @RequestBody UpdateTicketStatusRequest request) {
        TicketResponse ticketResponse = ticketService.updateTicketStatus(ticketId, request);
        return new ResponseEntity<>(ticketResponse, HttpStatus.OK);
    }

    /**
     * Add a comment to a ticket
     * POST /api/tickets/{ticketId}/comments
     */
    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<TicketResponse> addComment(
            @PathVariable String ticketId,
            @Valid @RequestBody AddCommentRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Name", required = false) String userName) {

        if (userId == null || userId.isEmpty() || userName == null || userName.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TicketResponse ticketResponse = ticketService.addComment(ticketId, userId, userName, request);
        return new ResponseEntity<>(ticketResponse, HttpStatus.OK);
    }

    /**
     * Edit a comment in a ticket (owner only)
     * PUT /api/tickets/{ticketId}/comments/{commentId}
     */
    @PutMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<TicketResponse> editComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @Valid @RequestBody AddCommentRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        if (userId == null || userId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TicketResponse ticketResponse = ticketService.editComment(ticketId, commentId, userId, request);
        return new ResponseEntity<>(ticketResponse, HttpStatus.OK);
    }

    /**
     * Delete a comment from a ticket (owner only)
     * DELETE /api/tickets/{ticketId}/comments/{commentId}
     */
    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<TicketResponse> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        if (userId == null || userId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TicketResponse ticketResponse = ticketService.deleteComment(ticketId, commentId, userId);
        return new ResponseEntity<>(ticketResponse, HttpStatus.OK);
    }
}
