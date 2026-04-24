package com.example.resourceapp.repository;

import com.example.resourceapp.model.Booking;
import com.example.resourceapp.model.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    // Find all bookings for a specific resource
    List<Booking> findByResourceId(String resourceId);
    
    // Find all bookings for a specific user
    List<Booking> findByUserId(String userId);
    
    // Find bookings by status
    List<Booking> findByStatus(BookingStatus status);
    
    // Find overlapping bookings for conflict detection
    List<Booking> findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
            String resourceId, BookingStatus status, LocalDateTime endTime, LocalDateTime startTime);
    
    // Find approved bookings for a resource within a time range
    List<Booking> findByResourceIdAndStatusAndStartTimeGreaterThanEqualAndEndTimeLessThanEqual(
            String resourceId, BookingStatus status, LocalDateTime startTime, LocalDateTime endTime);
}
