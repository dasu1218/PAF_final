package com.smartcampus.service;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.dto.BookingResponse;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.BookingConflictException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.exception.UnauthorizedException;
import com.smartcampus.model.Booking;
import com.smartcampus.model.Resource;
import com.smartcampus.model.User;
import com.smartcampus.model.enums.BookingStatus;
import com.smartcampus.model.enums.UserRole;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        // Validate request
        validateBookingRequest(request);

        // Get user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify resource exists
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + request.getResourceId()));

        // Check if resource is active
        if (!"ACTIVE".equals(resource.getStatus())) {
            throw new BadRequestException("Resource is not available for booking");
        }

        // Check for scheduling conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getResourceId(),
                request.getStartDateTime(),
                request.getEndDateTime()
        );

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "The resource is already booked for the selected time period. " +
                    "Conflicting booking(s) exist."
            );
        }

        // Create booking
        Booking booking = Booking.builder()
                .resourceId(request.getResourceId())
                .userId(user.getId())
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getEndDateTime())
                .purpose(request.getPurpose())
                .expectedAttendees(request.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return bookings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings(String status) {
        List<Booking> bookings;
        if (status != null && !status.isEmpty()) {
            try {
                BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
                bookings = bookingRepository.findByStatusOrderByCreatedAtDesc(bookingStatus);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid booking status: " + status);
            }
        } else {
            bookings = bookingRepository.findAllByOrderByCreatedAtDesc();
        }

        return bookings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user has permission to view this booking
        if (user.getRole() != UserRole.ADMIN && !booking.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to view this booking");
        }

        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse approveBooking(Long id, String adminNotes, String adminEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be approved");
        }

        // Re-check for conflicts in case other bookings were approved in the meantime
        List<Booking> conflicts = bookingRepository.findConflictingBookingsExcluding(
                booking.getResourceId(),
                booking.getId(),
                booking.getStartDateTime(),
                booking.getEndDateTime()
        );

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "Cannot approve: conflicting approved booking(s) exist"
            );
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminNotes(adminNotes);
        booking.setReviewedByUserId(admin.getId());
        booking.setReviewedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    @Transactional
    public BookingResponse rejectBooking(Long id, String adminNotes, String adminEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminNotes(adminNotes);
        booking.setReviewedByUserId(admin.getId());
        booking.setReviewedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Only the booking owner or an admin can cancel
        if (user.getRole() != UserRole.ADMIN && !booking.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        if (booking.getStatus() == BookingStatus.REJECTED) {
            throw new BadRequestException("Cannot cancel a rejected booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    @Transactional
    public void deleteBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Only the booking owner can delete their own pending/rejected bookings
        // Admins can delete any booking
        if (user.getRole() != UserRole.ADMIN && !booking.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to delete this booking");
        }

        // Only allow deletion of pending or rejected bookings
        if (booking.getStatus() == BookingStatus.APPROVED) {
            throw new BadRequestException("Cannot delete approved bookings. Please cancel first.");
        }

        bookingRepository.delete(booking);
    }

    private void validateBookingRequest(BookingRequest request) {
        if (request.getEndDateTime().isBefore(request.getStartDateTime()) ||
                request.getEndDateTime().isEqual(request.getStartDateTime())) {
            throw new BadRequestException("End date/time must be after start date/time");
        }

        if (request.getStartDateTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot create bookings in the past");
        }

        // Optional: Add maximum booking duration check
        long hoursDifference = java.time.Duration.between(
                request.getStartDateTime(),
                request.getEndDateTime()
        ).toHours();

        if (hoursDifference > 24 * 7) { // Max 1 week
            throw new BadRequestException("Booking duration cannot exceed 7 days");
        }
    }

    private BookingResponse mapToResponse(Booking booking) {
        // Fetch user details
        User user = userRepository.findById(booking.getUserId()).orElse(null);
        
        // Fetch resource details
        Resource resource = resourceRepository.findById(booking.getResourceId()).orElse(null);
        
        // Fetch reviewer details if available
        User reviewer = null;
        if (booking.getReviewedByUserId() != null) {
            reviewer = userRepository.findById(booking.getReviewedByUserId()).orElse(null);
        }

        return BookingResponse.builder()
                .id(booking.getId())
                .resourceId(booking.getResourceId())
                .resourceName(resource != null ? resource.getName() : "Unknown Resource")
                .userId(booking.getUserId())
                .userFullName(user != null ? user.getFullName() : "Unknown User")
                .startDateTime(booking.getStartDateTime())
                .endDateTime(booking.getEndDateTime())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees())
                .status(booking.getStatus())
                .adminNotes(booking.getAdminNotes())
                .reviewedByUserId(booking.getReviewedByUserId())
                .reviewedByUserName(reviewer != null ? reviewer.getFullName() : null)
                .reviewedAt(booking.getReviewedAt())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
