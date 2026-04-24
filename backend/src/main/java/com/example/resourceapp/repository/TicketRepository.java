package com.example.resourceapp.repository;

import com.example.resourceapp.model.Ticket;
import com.example.resourceapp.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByCreatedByUserId(String userId);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByResourceId(String resourceId);
    List<Ticket> findByAssignedToUserId(String technicianId);
    List<Ticket> findByLocation(String location);
    List<Ticket> findAll();
}
