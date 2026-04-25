package com.smartcampus.controller;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.dto.BookingResponse;
import com.smartcampus.dto.BookingReviewRequest;
import com.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class BookingController {

    private final BookingService bookingService;

    /**
     * Create a new booking request
     * Endpoint: POST /api/bookings
     * Access: USER, ADMIN
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        BookingResponse response = bookingService.createBooking(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all bookings for the authenticated user
     * Endpoint: GET /api/bookings/my-bookings
     * Access: USER, ADMIN
     */
    @GetMapping("/my-bookings")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        String userEmail = authentication.getName();
        List<BookingResponse> bookings = bookingService.getUserBookings(userEmail);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Get all bookings (admin only, with optional status filter)
     * Endpoint: GET /api/bookings?status=PENDING
     * Access: ADMIN
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestParam(required = false) String status) {
        List<BookingResponse> bookings = bookingService.getAllBookings(status);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Get a specific booking by ID
     * Endpoint: GET /api/bookings/{id}
     * Access: USER (own bookings), ADMIN (all bookings)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        BookingResponse booking = bookingService.getBookingById(id, userEmail);
        return ResponseEntity.ok(booking);
    }

    /**
     * Approve a booking request
     * Endpoint: PUT /api/bookings/{id}/approve
     * Access: ADMIN
     */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingReviewRequest request,
            Authentication authentication) {
        String adminEmail = authentication.getName();
        BookingResponse response = bookingService.approveBooking(id, request.getAdminNotes(), adminEmail);
        return ResponseEntity.ok(response);
    }

    /**
     * Reject a booking request
     * Endpoint: PUT /api/bookings/{id}/reject
     * Access: ADMIN
     */
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingReviewRequest request,
            Authentication authentication) {
        String adminEmail = authentication.getName();
        BookingResponse response = bookingService.rejectBooking(id, request.getAdminNotes(), adminEmail);
        return ResponseEntity.ok(response);
    }

    /**
     * Cancel a booking (user can cancel their own, admin can cancel any)
     * Endpoint: PUT /api/bookings/{id}/cancel
     * Access: USER (own bookings), ADMIN (all bookings)
     */
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        BookingResponse response = bookingService.cancelBooking(id, userEmail);
        return ResponseEntity.ok(response);
    }

    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteBooking(
            @PathVariable Long id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        bookingService.deleteBooking(id, userEmail);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Booking deleted successfully");
        return ResponseEntity.ok(response);
    }
}
