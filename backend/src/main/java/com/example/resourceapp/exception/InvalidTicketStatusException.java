package com.example.resourceapp.exception;

public class InvalidTicketStatusException extends RuntimeException {
    public InvalidTicketStatusException(String message) {
        super(message);
    }

    public InvalidTicketStatusException(String message, Throwable cause) {
        super(message, cause);
    }
}
