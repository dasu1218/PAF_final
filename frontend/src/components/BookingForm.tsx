import React, { useState } from 'react';
import { Resource } from '../types/Resource';
import { BookingRequest } from '../types/Booking';
import { bookingApi } from '../api/bookingApi';
import { X, Calendar, Clock, Users, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface BookingFormProps {
  resource: Resource;
  onSuccess: () => void;
  onCancel: () => void;
  userId: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ resource, onSuccess, onCancel, userId }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: 1,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'expectedAttendees' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.startDate || !formData.startTime || !formData.endTime) {
        throw new Error('Please provide all time information');
      }

      if (formData.expectedAttendees > resource.capacity) {
        throw new Error(`Expected attendees cannot exceed resource capacity of ${resource.capacity}`);
      }

      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
      const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`).toISOString();

      if (new Date(startDateTime) >= new Date(endDateTime)) {
        throw new Error('End time must be after start time');
      }

      const bookingRequest: BookingRequest = {
        resourceId: resource.id,
        startTime: startDateTime,
        endTime: endDateTime,
        purpose: formData.purpose,
        expectedAttendees: formData.expectedAttendees,
      };

      await bookingApi.create(bookingRequest, userId);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-center text-primary mb-2">Booking Created!</h3>
          <p className="text-center text-secondary mb-6">
            Your booking request for <strong>{resource.name}</strong> has been submitted and is awaiting admin approval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-primary">Book {resource.name}</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Date</label>
            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="flex-1 outline-none"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Start Time</label>
              <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="flex-1 outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">End Time</label>
              <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="flex-1 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Expected Attendees</label>
            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
              <Users className="h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="expectedAttendees"
                value={formData.expectedAttendees}
                onChange={handleInputChange}
                min="1"
                max={resource.capacity}
                className="flex-1 outline-none"
                required
              />
              <span className="text-sm text-gray-500">/ {resource.capacity}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Purpose</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Describe the purpose of your booking..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#F27D26] focus:ring-2 focus:ring-[#F27D26]/20 resize-none"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Location:</strong> {resource.location}
            </p>
            <p className="text-sm text-blue-800 mt-1">
              Your booking will be pending approval from the admin.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#F27D26] text-white rounded-lg font-medium hover:bg-[#ff9548] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Request Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
