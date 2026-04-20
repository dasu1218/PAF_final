package com.smartcampus.config;

import com.smartcampus.model.Resource;
import com.smartcampus.model.User;
import com.smartcampus.model.enums.UserRole;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeUsers();
        initializeResources();
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            // Create admin user
            User admin = User.builder()
                    .email("admin@smartcampus.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Admin User")
                    .role(UserRole.ADMIN)
                    .active(true)
                    .build();

            // Create regular user
            User user = User.builder()
                    .email("user@smartcampus.com")
                    .password(passwordEncoder.encode("user123"))
                    .fullName("Regular User")
                    .role(UserRole.USER)
                    .active(true)
                    .build();

            // Create technician user
            User technician = User.builder()
                    .email("tech@smartcampus.com")
                    .password(passwordEncoder.encode("tech123"))
                    .fullName("Technician User")
                    .role(UserRole.TECHNICIAN)
                    .active(true)
                    .build();

            userRepository.saveAll(Arrays.asList(admin, user, technician));
            System.out.println("✓ Sample users created successfully");
            System.out.println("  - Admin: admin@smartcampus.com / admin123");
            System.out.println("  - User: user@smartcampus.com / user123");
            System.out.println("  - Technician: tech@smartcampus.com / tech123");
        }
    }

    private void initializeResources() {
        if (resourceRepository.count() == 0) {
            Resource lectureHall1 = Resource.builder()
                    .name("Lecture Hall A1")
                    .type("LECTURE_HALL")
                    .capacity(100)
                    .location("Building A, Floor 1")
                    .status("ACTIVE")
                    .description("Large lecture hall with projector and sound system")
                    .build();

            Resource lab1 = Resource.builder()
                    .name("Computer Lab B2")
                    .type("COMPUTER_LAB")
                    .capacity(30)
                    .location("Building B, Floor 2")
                    .status("ACTIVE")
                    .description("Computer lab with 30 workstations")
                    .build();

            Resource meetingRoom1 = Resource.builder()
                    .name("Meeting Room C1")
                    .type("MEETING_ROOM")
                    .capacity(10)
                    .location("Building C, Floor 1")
                    .status("ACTIVE")
                    .description("Small meeting room with conference table")
                    .build();

            Resource projector1 = Resource.builder()
                    .name("Projector HD-01")
                    .type("PROJECTOR")
                    .capacity(null)
                    .location("Equipment Storage")
                    .status("ACTIVE")
                    .description("Portable HD projector")
                    .build();

            Resource camera1 = Resource.builder()
                    .name("Video Camera VC-01")
                    .type("CAMERA")
                    .capacity(null)
                    .location("Equipment Storage")
                    .status("ACTIVE")
                    .description("Professional video camera for events")
                    .build();

            resourceRepository.saveAll(Arrays.asList(
                    lectureHall1, lab1, meetingRoom1, projector1, camera1
            ));
            System.out.println("✓ Sample resources created successfully");
        }
    }
}
