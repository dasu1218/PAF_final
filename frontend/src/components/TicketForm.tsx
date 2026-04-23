import React, { useState } from 'react';
import { CreateTicketRequest, TicketPriority, TicketCategory } from '../types/Ticket';
import { ticketApi } from '../api/ticketApi';
import '../styles/TicketForm.css';

interface TicketFormProps {
  userId: string;
  userName: string;
  resourceId: string;
  location: string;
  onTicketCreated: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({
  userId,
  userName,
  resourceId,
  location,
  onTicketCreated,
}) => {
  const [formData, setFormData] = useState<CreateTicketRequest>({
    resourceId,
    location,
    category: 'EQUIPMENT_MALFUNCTION',
    description: '',
    priority: 'MEDIUM',
    preferredContactDetails: '',
    imageDataList: [],
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      if (selectedImages.length + newFiles.length > 3) {
        setError('Maximum 3 images allowed');
        return;
      }
      setSelectedImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Convert images to base64
      const imageDataList = await Promise.all(selectedImages.map((file) => fileToBase64(file)));

      const request: CreateTicketRequest = {
        ...formData,
        imageDataList,
      };

      await ticketApi.create(request, userId, userName);
      setSuccess(true);
      setFormData({
        resourceId,
        location,
        category: 'EQUIPMENT_MALFUNCTION',
        description: '',
        priority: 'MEDIUM',
        preferredContactDetails: '',
        imageDataList: [],
      });
      setSelectedImages([]);

      // Call callback to refresh parent
      setTimeout(() => {
        onTicketCreated();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-form-container">
      <h2>Create Maintenance Ticket</h2>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">Ticket created successfully!</div>}

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="EQUIPMENT_MALFUNCTION">Equipment Malfunction</option>
            <option value="DAMAGE">Damage</option>
            <option value="CLEANING">Cleaning</option>
            <option value="SAFETY_HAZARD">Safety Hazard</option>
            <option value="CONNECTIVITY_ISSUE">Connectivity Issue</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the issue in detail"
            rows={4}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              required
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="preferredContactDetails">Preferred Contact Details *</label>
            <input
              id="preferredContactDetails"
              type="text"
              name="preferredContactDetails"
              value={formData.preferredContactDetails}
              onChange={handleInputChange}
              placeholder="Email or phone number"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="images">Upload Images (up to 3) - Optional</label>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            disabled={selectedImages.length >= 3}
          />
          <p className="form-hint">
            {selectedImages.length}/3 images selected - Max 3 images showing as evidence
          </p>
        </div>

        {selectedImages.length > 0 && (
          <div className="image-preview-container">
            <h4>Selected Images:</h4>
            <div className="image-previews">
              {selectedImages.map((file, index) => (
                <div key={index} className="image-preview-item">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                  <p className="image-name">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating Ticket...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
