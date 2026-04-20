package com.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingReviewRequest {

    @NotBlank(message = "Admin notes are required")
    @Size(max = 500, message = "Admin notes must not exceed 500 characters")
    private String adminNotes;
}
