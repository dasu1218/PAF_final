import {
  Ticket,
  CreateTicketRequest,
  AddCommentRequest,
  UpdateTicketStatusRequest,
  AssignTicketRequest,
  TicketStatus,
} from '../types/Ticket';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

export const ticketApi = {
  // Create a new ticket
  create: async (ticketRequest: CreateTicketRequest, userId: string, userName: string): Promise<Ticket> => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
        'X-User-Name': userName,
      },
      body: JSON.stringify(ticketRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create ticket');
    }

    return response.json();
  },

  // Get all tickets (admin only)
  getAll: async (): Promise<Ticket[]> => {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return response.json();
  },

  // Get tickets by status
  getByStatus: async (status: TicketStatus): Promise<Ticket[]> => {
    const response = await fetch(`${API_BASE_URL}/status/${status}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${status} tickets`);
    }

    return response.json();
  },

  // Get tickets by resource ID
  getByResourceId: async (resourceId: string): Promise<Ticket[]> => {
    const response = await fetch(`${API_BASE_URL}/resource/${resourceId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch resource tickets');
    }

    return response.json();
  },

  // Get user's tickets (created by the user)
  getUserTickets: async (userId: string): Promise<Ticket[]> => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user tickets');
    }

    return response.json();
  },

  // Get tickets assigned to a technician
  getAssignedTickets: async (technicianId: string): Promise<Ticket[]> => {
    const response = await fetch(`${API_BASE_URL}/assigned/${technicianId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch assigned tickets');
    }

    return response.json();
  },

  // Get ticket by ID
  getById: async (ticketId: string): Promise<Ticket> => {
    const response = await fetch(`${API_BASE_URL}/${ticketId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }

    return response.json();
  },

  // Assign ticket to a technician
  assign: async (ticketId: string, assignRequest: AssignTicketRequest): Promise<Ticket> => {
    const response = await fetch(`${API_BASE_URL}/${ticketId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to assign ticket');
    }

    return response.json();
  },

  // Update ticket status
  updateStatus: async (
    ticketId: string,
    statusRequest: UpdateTicketStatusRequest
  ): Promise<Ticket> => {
    const response = await fetch(`${API_BASE_URL}/${ticketId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update ticket status');
    }

    return response.json();
  },

  // Add a comment to a ticket
  addComment: async (
    ticketId: string,
    commentRequest: AddCommentRequest,
    userId: string,
    userName: string
  ): Promise<Ticket> => {
    const response = await fetch(`${API_BASE_URL}/${ticketId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
        'X-User-Name': userName,
      },
      body: JSON.stringify(commentRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add comment');
    }

    return response.json();
  },

  // Edit a comment (owner only)
  editComment: async (
    ticketId: string,
    commentId: string,
    commentRequest: AddCommentRequest,
    userId: string
  ): Promise<Ticket> => {
    const response = await fetch(`${API_BASE_URL}/${ticketId}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify(commentRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to edit comment');
    }

    return response.json();
  },

  // Delete a comment (owner only)
  deleteComment: async (ticketId: string, commentId: string, userId: string): Promise<Ticket> => {
    const response = await fetch(`${API_BASE_URL}/${ticketId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'X-User-Id': userId,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete comment');
    }

    return response.json();
  },
};
