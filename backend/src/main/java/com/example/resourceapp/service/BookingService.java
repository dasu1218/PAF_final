package com.example.resourceapp.service;

import com.example.resourceapp.dto.BookingRequest;
import com.example.resourceapp.dto.BookingResponse;
import com.example.resourceapp.exception.BookingConflictException;
import com.example.resourceapp.exception.BookingNotFoundException;
import com.example.resourceapp.exception.ResourceNotFoundException;
import com.example.resourceapp.model.Booking;
import com.example.resourceapp.model.BookingStatus;
import com.example.resourceapp.model.Resource;
import com.example.resourceapp.repository.BookingRepository;
import com.example.resourceapp.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    @Autowired
    public BookingService(BookingRepository bookingRepository, ResourceRepository resourceRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.notificationService = notificationService;
    }

    /**
     * Create a new booking request
     * Checks for scheduling conflicts with approved bookings
     */
    public BookingResponse createBooking(BookingRequest bookingRequest, String userId) {
        // Validate resource exists
        Resource resource = resourceRepository.findById(bookingRequest.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + bookingRequest.getResourceId()));

        // Validate time range
        if (bookingRequest.getStartTime().isAfter(bookingRequest.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        if (bookingRequest.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Booking time cannot be in the past");
        }

        // Check for scheduling conflicts with approved bookings
        checkSchedulingConflict(bookingRequest.getResourceId(), bookingRequest.getStartTime(), bookingRequest.getEndTime());

        // Validate capacity
        if (bookingRequest.getExpectedAttendees() > resource.getCapacity()) {
            throw new IllegalArgumentException("Expected attendees exceeds resource capacity");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setResourceId(bookingRequest.getResourceId());
        booking.setUserId(userId);
        booking.setStartTime(bookingRequest.getStartTime());
        booking.setEndTime(bookingRequest.getEndTime());
        booking.setPurpose(bookingRequest.getPurpose());
        booking.setExpectedAttendees(bookingRequest.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);
        return convertToResponse(savedBooking);
    }

    /**
     * Check for scheduling conflicts with approved bookings
     */
    private void checkSchedulingConflict(String resourceId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Booking> conflictingBookings = bookingRepository
                .findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                        resourceId, BookingStatus.APPROVED, endTime, startTime);

        if (!conflictingBookings.isEmpty()) {
            throw new BookingConflictException("Resource is not available for the requested time range. There are conflicting bookings.");
        }
    }

    /**
     * Get all bookings (admin only)
     */
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get bookings by status (admin only)
     */
    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get user's own bookings
     */
    public List<BookingResponse> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get bookings for a specific resource
     */
    public List<BookingResponse> getResourceBookings(String resourceId) {
        return bookingRepository.findByResourceId(resourceId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific booking by ID
     */
    public BookingResponse getBookingById(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
        return convertToResponse(booking);
    }

    /**
     * Approve a booking (admin only)
     */
    public BookingResponse approveBooking(String bookingId, String adminId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be approved");
        }

        // Check for conflicts again before approval
        checkSchedulingConflict(booking.getResourceId(), booking.getStartTime(), booking.getEndTime());

        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovedAt(LocalDateTime.now());
        booking.setApprovedBy(adminId);

        Booking savedBooking = bookingRepository.save(booking);
        
        // Notify user
        notificationService.createNotification(
            booking.getUserId(),
            "Your booking for " + booking.getResourceId() + " has been APPROVED.",
            "BOOKING",
            booking.getId()
        );
        
        return convertToResponse(savedBooking);
    }

    /**
     * Reject a booking (admin only)
     */
    public BookingResponse rejectBooking(String bookingId, String rejectionReason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(rejectionReason);

        Booking savedBooking = bookingRepository.save(booking);

        // Notify user
        notificationService.createNotification(
            booking.getUserId(),
            "Your booking for " + booking.getResourceId() + " has been REJECTED. Reason: " + rejectionReason,
            "BOOKING",
            booking.getId()
        );

        return convertToResponse(savedBooking);
    }

    /**
     * Cancel an approved booking (user or admin)
     */
    public BookingResponse cancelBooking(String bookingId, String cancellationReason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only approved bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancellationReason(cancellationReason);

        Booking savedBooking = bookingRepository.save(booking);

        // Notify relevant parties if needed (e.g., admin)
        // For now, just notify the user themselves as confirmation
        notificationService.createNotification(
            booking.getUserId(),
            "Your booking for " + booking.getResourceId() + " has been CANCELLED.",
            "BOOKING",
            booking.getId()
        );

        return convertToResponse(savedBooking);
    }

    /**
     * Convert Booking entity to BookingResponse DTO
     */
    private BookingResponse convertToResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getResourceId(),
                booking.getUserId(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.getStatus(),
                booking.getRejectionReason(),
                booking.getCreatedAt(),
                booking.getApprovedAt(),
                booking.getApprovedBy(),
                booking.getCancelledAt(),
                booking.getCancellationReason()
        );
    }
}
