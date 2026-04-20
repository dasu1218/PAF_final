import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';

function CreateBooking() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    resourceId: '',
    startDateTime: '',
    endDateTime: '',
    purpose: '',
    expectedAttendees: '',
  });

  // Sample resources (in real app, fetch from API)
  const resources = [
    { id: 1, name: 'Lecture Hall A1' },
    { id: 2, name: 'Computer Lab B2' },
    { id: 3, name: 'Meeting Room C1' },
    { id: 4, name: 'Projector HD-01' },
    { id: 5, name: 'Video Camera VC-01' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const bookingData = {
        resourceId: parseInt(formData.resourceId),
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
        purpose: formData.purpose,
        expectedAttendees: formData.expectedAttendees
          ? parseInt(formData.expectedAttendees)
          : null,
      };

      await bookingService.createBooking(bookingData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        <h2>Create New Booking</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Booking created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Resource *</label>
            <select
              name="resourceId"
              value={formData.resourceId}
              onChange={handleChange}
              required
            >
              <option value="">Select a resource</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Start Date & Time *</label>
            <input
              type="datetime-local"
              name="startDateTime"
              value={formData.startDateTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date & Time *</label>
            <input
              type="datetime-local"
              name="endDateTime"
              value={formData.endDateTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Purpose *</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Describe the purpose of this booking"
              required
            />
          </div>

          <div className="form-group">
            <label>Expected Attendees</label>
            <input
              type="number"
              name="expectedAttendees"
              value={formData.expectedAttendees}
              onChange={handleChange}
              placeholder="Number of attendees (optional)"
              min="1"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/my-bookings')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBooking;
