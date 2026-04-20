package com.smartcampus.service;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.dto.BookingResponse;
import com.smartcampus.exception.BookingConflictException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Booking;
import com.smartcampus.model.Resource;
import com.smartcampus.model.User;
import com.smartcampus.model.enums.BookingStatus;
import com.smartcampus.model.enums.UserRole;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ResourceRepository resourceRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookingService bookingService;

    private User testUser;
    private Resource testResource;
    private BookingRequest testBookingRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .fullName("Test User")
                .role(UserRole.USER)
                .build();

        testResource = Resource.builder()
                .id(1L)
                .name("Test Room")
                .type("MEETING_ROOM")
                .status("ACTIVE")
                .build();

        testBookingRequest = BookingRequest.builder()
                .resourceId(1L)
                .startDateTime(LocalDateTime.now().plusDays(1))
                .endDateTime(LocalDateTime.now().plusDays(1).plusHours(2))
                .purpose("Test meeting")
                .expectedAttendees(5)
                .build();
    }

    @Test
    void createBooking_Success() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(resourceRepository.findById(anyLong())).thenReturn(Optional.of(testResource));
        when(bookingRepository.findConflictingBookings(anyLong(), any(), any()))
                .thenReturn(new ArrayList<>());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(1L);
            return booking;
        });

        // Act
        BookingResponse response = bookingService.createBooking(testBookingRequest, "test@example.com");

        // Assert
        assertNotNull(response);
        assertEquals(BookingStatus.PENDING, response.getStatus());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void createBooking_ConflictDetected() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(resourceRepository.findById(anyLong())).thenReturn(Optional.of(testResource));
        
        List<Booking> conflicts = new ArrayList<>();
        conflicts.add(new Booking());
        when(bookingRepository.findConflictingBookings(anyLong(), any(), any()))
                .thenReturn(conflicts);

        // Act & Assert
        assertThrows(BookingConflictException.class, () -> {
            bookingService.createBooking(testBookingRequest, "test@example.com");
        });
    }

    @Test
    void createBooking_ResourceNotFound() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(resourceRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            bookingService.createBooking(testBookingRequest, "test@example.com");
        });
    }

    @Test
    void getUserBookings_Success() {
        // Arrange
        List<Booking> bookings = new ArrayList<>();
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setUserId(1L);
        booking.setResourceId(1L);
        bookings.add(booking);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(bookingRepository.findByUserIdOrderByCreatedAtDesc(anyLong())).thenReturn(bookings);
        when(resourceRepository.findById(anyLong())).thenReturn(Optional.of(testResource));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));

        // Act
        List<BookingResponse> responses = bookingService.getUserBookings("test@example.com");

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
    }

    @Test
    void approveBooking_Success() {
        // Arrange
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setStatus(BookingStatus.PENDING);
        booking.setResourceId(1L);
        booking.setUserId(1L);
        booking.setStartDateTime(LocalDateTime.now().plusDays(1));
        booking.setEndDateTime(LocalDateTime.now().plusDays(1).plusHours(2));

        User admin = User.builder()
                .id(2L)
                .email("admin@example.com")
                .fullName("Admin User")
                .role(UserRole.ADMIN)
                .build();

        when(bookingRepository.findById(anyLong())).thenReturn(Optional.of(booking));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(admin));
        when(bookingRepository.findConflictingBookingsExcluding(anyLong(), anyLong(), any(), any()))
                .thenReturn(new ArrayList<>());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(resourceRepository.findById(anyLong())).thenReturn(Optional.of(testResource));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));

        // Act
        BookingResponse response = bookingService.approveBooking(1L, "Approved", "admin@example.com");

        // Assert
        assertNotNull(response);
        assertEquals(BookingStatus.APPROVED, response.getStatus());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }
}
