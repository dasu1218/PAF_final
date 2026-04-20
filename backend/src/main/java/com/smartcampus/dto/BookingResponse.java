package com.smartcampus.dto;

import com.smartcampus.model.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private Long resourceId;
    private String resourceName;
    private Long userId;
    private String userFullName;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status;
    private String adminNotes;
    private Long reviewedByUserId;
    private String reviewedByUserName;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
