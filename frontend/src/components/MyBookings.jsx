import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import BookingCard from './BookingCard';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
      setError('');
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(id);
      setActionMessage('Booking cancelled successfully');
      fetchBookings();
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await bookingService.deleteBooking(id);
      setActionMessage('Booking deleted successfully');
      fetchBookings();
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Bookings</h2>
        <button
          className="btn btn-primary"
          onClick={() => window.location.href = '/create-booking'}
        >
          + New Booking
        </button>
      </div>

      {actionMessage && (
        <div className="alert alert-success">{actionMessage}</div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      {bookings.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#6c757d' }}>
            No bookings found. Create your first booking to get started!
          </p>
        </div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
              onDelete={handleDelete}
              isAdmin={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
