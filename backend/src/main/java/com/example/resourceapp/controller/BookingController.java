package com.example.resourceapp.controller;

import com.example.resourceapp.dto.BookingRequest;
import com.example.resourceapp.dto.BookingResponse;
import com.example.resourceapp.model.BookingStatus;
import com.example.resourceapp.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Create a new booking request
     * POST /api/bookings
     */
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest bookingRequest,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        BookingResponse bookingResponse = bookingService.createBooking(bookingRequest, userId);
        return new ResponseEntity<>(bookingResponse, HttpStatus.CREATED);
    }

    /**
     * Get all bookings (admin only)
     * GET /api/bookings
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    /**
     * Get bookings by status
     * GET /api/bookings/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingResponse>> getBookingsByStatus(@PathVariable String status) {
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            List<BookingResponse> bookings = bookingService.getBookingsByStatus(bookingStatus);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get user's own bookings
     * GET /api/bookings/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getUserBookings(@PathVariable String userId) {
        List<BookingResponse> bookings = bookingService.getUserBookings(userId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    /**
     * Get bookings for a specific resource
     * GET /api/bookings/resource/{resourceId}
     */
    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<List<BookingResponse>> getResourceBookings(@PathVariable String resourceId) {
        List<BookingResponse> bookings = bookingService.getResourceBookings(resourceId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    /**
     * Get a specific booking by ID
     * GET /api/bookings/{bookingId}
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String bookingId) {
        BookingResponse booking = bookingService.getBookingById(bookingId);
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }

    /**
     * Approve a booking (admin only)
     * PUT /api/bookings/{bookingId}/approve
     */
    @PutMapping("/{bookingId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable String bookingId,
            @RequestHeader(value = "X-User-Id", required = false) String adminId) {
        
        if (adminId == null || adminId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        BookingResponse bookingResponse = bookingService.approveBooking(bookingId, adminId);
        return new ResponseEntity<>(bookingResponse, HttpStatus.OK);
    }

    /**
     * Reject a booking (admin only)
     * PUT /api/bookings/{bookingId}/reject
     */
    @PutMapping("/{bookingId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> requestBody) {
        
        String rejectionReason = requestBody.getOrDefault("reason", "No reason provided");
        BookingResponse bookingResponse = bookingService.rejectBooking(bookingId, rejectionReason);
        return new ResponseEntity<>(bookingResponse, HttpStatus.OK);
    }

    /**
     * Cancel an approved booking
     * PUT /api/bookings/{bookingId}/cancel
     */
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> requestBody) {
        
        String cancellationReason = requestBody.getOrDefault("reason", "No reason provided");
        BookingResponse bookingResponse = bookingService.cancelBooking(bookingId, cancellationReason);
        return new ResponseEntity<>(bookingResponse, HttpStatus.OK);
    }
}
