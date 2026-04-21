import { BookingRequest, BookingResponse } from '../types/Booking';

const API_BASE_URL = 'http://localhost:8080/api/bookings';

export const bookingApi = {
  // Create a new booking
  create: async (bookingRequest: BookingRequest, userId: string): Promise<BookingResponse> => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify(bookingRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create booking');
    }

    return response.json();
  },

  // Get all bookings (admin)
  getAll: async (): Promise<BookingResponse[]> => {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    return response.json();
  },

  // Get bookings by status
  getByStatus: async (status: string): Promise<BookingResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/status/${status}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${status} bookings`);
    }

    return response.json();
  },

  // Get user's bookings
  getUserBookings: async (userId: string): Promise<BookingResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user bookings');
    }

    return response.json();
  },

  // Get bookings for a specific resource
  getResourceBookings: async (resourceId: string): Promise<BookingResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/resource/${resourceId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch resource bookings');
    }

    return response.json();
  },

  // Get a specific booking
  getById: async (bookingId: string): Promise<BookingResponse> => {
    const response = await fetch(`${API_BASE_URL}/${bookingId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch booking');
    }

    return response.json();
  },

  // Approve a booking (admin)
  approve: async (bookingId: string, adminId: string): Promise<BookingResponse> => {
    const response = await fetch(`${API_BASE_URL}/${bookingId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': adminId,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to approve booking');
    }

    return response.json();
  },

  // Reject a booking (admin)
  reject: async (bookingId: string, reason: string): Promise<BookingResponse> => {
    const response = await fetch(`${API_BASE_URL}/${bookingId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reject booking');
    }

    return response.json();
  },

  // Cancel a booking
  cancel: async (bookingId: string, reason: string): Promise<BookingResponse> => {
    const response = await fetch(`${API_BASE_URL}/${bookingId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel booking');
    }

    return response.json();
  },
};
