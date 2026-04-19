import React, { useState, useEffect } from 'react';
import { Resource } from '../types/Resource';
import { resourceApi } from '../api/resourceApi';
import { Save, X, Plus, Trash2, Wand2, ListChecks, BadgeInfo } from 'lucide-react';

interface ResourceFormProps {
  resourceId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const RESOURCE_TYPES = ['Student Hall', 'Lecture Hall', 'Canteen area', 'other'];

export const ResourceForm: React.FC<ResourceFormProps> = ({ resourceId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<Omit<Resource, 'id'>>({
    name: '',
    type: '',
    capacity: 1,
    location: '',
    availabilityWindows: [''],
    status: 'ACTIVE',
    metadata: {}
  });

  const [metadataEntries, setMetadataEntries] = useState<{key: string, value: string}[]>([
    { key: '', value: '' }
  ]);

  useEffect(() => {
    if (resourceId) {
      loadResource(resourceId);
    }
  }, [resourceId]);

  const loadResource = async (id: string) => {
    try {
      setLoading(true);
      const data = await resourceApi.getById(id);
      setFormData({
        name: data.name,
        type: data.type,
        capacity: data.capacity,
        location: data.location,
        availabilityWindows: data.availabilityWindows.length ? data.availabilityWindows : [''],
        status: data.status,
        metadata: data.metadata
      });
      
      const entries = Object.entries(data.metadata || {}).map(([key, value]) => ({
        key, value: String(value)
      }));
      if (entries.length > 0) {
        setMetadataEntries(entries);
      } else {
        setMetadataEntries([{ key: '', value: '' }]);
      }
    } catch (err) {
      setError('Failed to load resource details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleWindowChange = (index: number, value: string) => {
    const newWindows = [...formData.availabilityWindows];
    newWindows[index] = value;
    setFormData(prev => ({ ...prev, availabilityWindows: newWindows }));
  };

  const addWindow = () => {
    setFormData(prev => ({ ...prev, availabilityWindows: [...prev.availabilityWindows, ''] }));
  };

  const removeWindow = (index: number) => {
    const newWindows = formData.availabilityWindows.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, availabilityWindows: newWindows.length ? newWindows : [''] }));
  };

  const handleMetadataChange = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...metadataEntries];
    newEntries[index][field] = value;
    setMetadataEntries(newEntries);
  };

  const addMetadataEntry = () => {
    setMetadataEntries(prev => [...prev, { key: '', value: '' }]);
  };

  const removeMetadataEntry = (index: number) => {
    setMetadataEntries(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name || !formData.type || !formData.location || formData.capacity < 1) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    // Process metadata
    const metadata: Record<string, string> = {};
    metadataEntries.forEach(entry => {
      if (entry.key.trim() && entry.value.trim()) {
        metadata[entry.key.trim()] = entry.value.trim();
      }
    });

    const finalData = {
      ...formData,
      availabilityWindows: formData.availabilityWindows.filter(w => w.trim() !== ''),
      metadata
    };

    try {
      setLoading(true);
      if (resourceId) {
        await resourceApi.update(resourceId, finalData);
      } else {
        await resourceApi.create(finalData);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border/70 bg-surface/85 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-colors duration-300">
      <div className="relative overflow-hidden border-b border-border/70 px-6 py-6 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,125,38,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              <Wand2 className="h-3.5 w-3.5 text-[#F27D26]" />
              Resource editor
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {resourceId ? 'Edit resource details' : 'Create a new resource'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-secondary sm:text-base">
              Keep the fields clean, structured, and easy to review before saving changes.
            </p>
          </div>
          <button onClick={onCancel} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background/70 text-secondary transition hover:-translate-y-0.5 hover:text-primary hover:shadow-md">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-500 sm:mx-8">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-border/70 bg-input/90 px-4 py-3 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted">Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-2xl border border-border/70 bg-input/90 px-4 py-3 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
              required
            >
              <option value="" disabled>
                Select a type
              </option>
              {RESOURCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted">Capacity *</label>
            <input
              type="number"
              name="capacity"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full rounded-2xl border border-border/70 bg-input/90 px-4 py-3 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-2xl border border-border/70 bg-input/90 px-4 py-3 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full appearance-none rounded-2xl border border-border/70 bg-input/90 px-4 py-3 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
            >
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-border/70 bg-background/50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                <ListChecks className="h-4 w-4 text-[#F27D26]" />
                Availability Windows
              </label>
              <p className="mt-1 text-sm text-secondary">Add one or more windows for when this resource is available.</p>
            </div>
            <button type="button" onClick={addWindow} className="inline-flex items-center gap-2 rounded-full border border-[#F27D26]/20 bg-[#F27D26]/10 px-3 py-2 text-xs font-semibold text-[#F27D26] transition hover:bg-[#F27D26]/15">
              <Plus className="h-3 w-3" /> Add Window
            </button>
          </div>
          {formData.availabilityWindows.map((window, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={window}
                onChange={(e) => handleWindowChange(index, e.target.value)}
                placeholder="e.g. 09:00-17:00"
                className="flex-1 rounded-2xl border border-border/70 bg-input/90 px-4 py-3 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
              />
              <button type="button" onClick={() => removeWindow(index)} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-input/90 text-secondary transition hover:text-red-500 hover:shadow-md">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-border/70 bg-background/50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                <BadgeInfo className="h-4 w-4 text-[#F27D26]" />
                Metadata (Key-Value Pairs)
              </label>
              <p className="mt-1 text-sm text-secondary">Store extra notes or operational details without changing the core schema.</p>
            </div>
            <button type="button" onClick={addMetadataEntry} className="inline-flex items-center gap-2 rounded-full border border-[#F27D26]/20 bg-[#F27D26]/10 px-3 py-2 text-xs font-semibold text-[#F27D26] transition hover:bg-[#F27D26]/15">
              <Plus className="h-3 w-3" /> Add Metadata
            </button>
          </div>
          {metadataEntries.map((entry, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={entry.key}
                onChange={(e) => handleMetadataChange(index, 'key', e.target.value)}
                placeholder="Key"
                className="w-1/3 rounded-2xl border border-border/70 bg-input/90 px-4 py-3 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
              />
              <input
                type="text"
                value={entry.value}
                onChange={(e) => handleMetadataChange(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 rounded-2xl border border-border/70 bg-input/90 px-4 py-3 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
              />
              <button type="button" onClick={() => removeMetadataEntry(index)} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-input/90 text-secondary transition hover:text-red-500 hover:shadow-md">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border/70 bg-background/70 px-6 py-3 font-medium text-muted transition hover:text-primary hover:shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F27D26] px-6 py-3 font-medium text-white shadow-lg shadow-[#F27D26]/25 transition hover:-translate-y-0.5 hover:bg-[#ff9548] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {resourceId ? 'Update Resource' : 'Save Resource'}
          </button>
        </div>
      </form>
    </div>
  );
};
