package com.campus.hub.ticket;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @InjectMocks
    private TicketService ticketService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateTicket_SetsInitialStatus() {
        Ticket ticket = new Ticket();
        ticket.setTitle("Leaking Pipe");
        
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);

        Ticket saved = ticketService.createTicket(ticket);
        
        assertEquals("OPEN", saved.getStatus());
        verify(ticketRepository, times(1)).save(ticket);
    }

    @Test
    void testUpdateTicketStatus() {
        String ticketId = "123";
        Ticket ticket = new Ticket();
        ticket.setId(ticketId);
        ticket.setStatus("OPEN");

        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);

        Ticket updated = ticketService.updateTicketStatus(ticketId, "IN_PROGRESS");

        assertEquals("IN_PROGRESS", updated.getStatus());
        verify(ticketRepository).save(ticket);
    }
}
