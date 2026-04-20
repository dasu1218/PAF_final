package com.smartcampus.repository;

import com.smartcampus.model.Booking;
import com.smartcampus.model.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings by user ID
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Find bookings by status
    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    // Find all bookings ordered by creation date
    List<Booking> findAllByOrderByCreatedAtDesc();

    // Check for scheduling conflicts - overlapping bookings for the same resource
    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.status IN ('PENDING', 'APPROVED') " +
           "AND ((b.startDateTime < :endDateTime AND b.endDateTime > :startDateTime))")
    List<Booking> findConflictingBookings(
        @Param("resourceId") Long resourceId,
        @Param("startDateTime") LocalDateTime startDateTime,
        @Param("endDateTime") LocalDateTime endDateTime
    );

    // Check for conflicts excluding a specific booking (for updates)
    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.id != :bookingId " +
           "AND b.status IN ('PENDING', 'APPROVED') " +
           "AND ((b.startDateTime < :endDateTime AND b.endDateTime > :startDateTime))")
    List<Booking> findConflictingBookingsExcluding(
        @Param("resourceId") Long resourceId,
        @Param("bookingId") Long bookingId,
        @Param("startDateTime") LocalDateTime startDateTime,
        @Param("endDateTime") LocalDateTime endDateTime
    );

    // Find bookings by resource
    List<Booking> findByResourceIdOrderByStartDateTimeDesc(Long resourceId);
}
