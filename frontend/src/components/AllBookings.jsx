import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import BookingCard from './BookingCard';

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [reviewModal, setReviewModal] = useState({ show: false, bookingId: null, action: '' });
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings(statusFilter);
      setBookings(data);
      setError('');
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (bookingId, action) => {
    setReviewModal({ show: true, bookingId, action });
    setAdminNotes('');
  };

  const closeReviewModal = () => {
    setReviewModal({ show: false, bookingId: null, action: '' });
    setAdminNotes('');
  };

  const handleReview = async () => {
    if (!adminNotes.trim()) {
      alert('Please provide admin notes');
      return;
    }

    try {
      if (reviewModal.action === 'approve') {
        await bookingService.approveBooking(reviewModal.bookingId, adminNotes);
        setActionMessage('Booking approved successfully');
      } else if (reviewModal.action === 'reject') {
        await bookingService.rejectBooking(reviewModal.bookingId, adminNotes);
        setActionMessage('Booking rejected successfully');
      }

      closeReviewModal();
      fetchBookings();
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${reviewModal.action} booking`);
      closeReviewModal();
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
    return <div className="loading">Loading all bookings...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>All Bookings (Admin)</h2>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {actionMessage && (
        <div className="alert alert-success">{actionMessage}</div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      {bookings.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#6c757d' }}>
            No bookings found.
          </p>
        </div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onApprove={(id) => openReviewModal(id, 'approve')}
              onReject={(id) => openReviewModal(id, 'reject')}
              onCancel={handleCancel}
              onDelete={handleDelete}
              isAdmin={true}
            />
          ))}
        </div>
      )}

      {reviewModal.show && (
        <div className="modal-overlay" onClick={closeReviewModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>
              {reviewModal.action === 'approve' ? 'Approve' : 'Reject'} Booking
            </h2>
            <div className="form-group">
              <label>Admin Notes *</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={`Provide reason for ${reviewModal.action}ing this booking`}
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeReviewModal}>
                Cancel
              </button>
              <button
                className={`btn ${reviewModal.action === 'approve' ? 'btn-success' : 'btn-danger'}`}
                onClick={handleReview}
              >
                Confirm {reviewModal.action === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllBookings;
