import api from './api';

export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user's own bookings
  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  // Get all bookings (admin only)
  getAllBookings: async (status = null) => {
    const url = status ? `/bookings?status=${status}` : '/bookings';
    const response = await api.get(url);
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Approve booking (admin only)
  approveBooking: async (id, adminNotes) => {
    const response = await api.put(`/bookings/${id}/approve`, { adminNotes });
    return response.data;
  },

  // Reject booking (admin only)
  rejectBooking: async (id, adminNotes) => {
    const response = await api.put(`/bookings/${id}/reject`, { adminNotes });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Delete booking
  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};
