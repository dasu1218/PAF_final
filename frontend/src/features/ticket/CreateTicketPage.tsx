import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, CheckCircle2, AlertCircle, MapPin, Tag, MessageSquare, Phone, User, Mail, GraduationCap } from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { ticketService } from './ticketService';
import { TicketCategory, TicketPriority } from './ticket';
import { cn } from '../../lib/utils';

export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string; time: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    faculty: '',
    title: '',
    description: '',
    category: 'OTHER' as TicketCategory,
    priority: 'MEDIUM' as TicketPriority,
    location: '',
    contactDetails: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      if (images.length + files.length > 3) {
        setError('Maximum 3 images allowed.');
        return;
      }

      const validFiles = files.filter(f => f.type === 'image/jpeg' || f.type === 'image/png');
      if (validFiles.length !== files.length) {
        setError('Only JPG and PNG files are allowed.');
        return;
      }

      setImages([...images, ...validFiles]);
      const newPreviews = validFiles.map(f => URL.createObjectURL(f));
      setPreviews([...previews, ...newPreviews]);
      setError(null);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Process images to attachments
      const processedAttachments = await Promise.all(
        images.map(async (file, index) => ({
          id: `att-${Date.now()}-${index}`,
          url: await fileToBase64(file),
          fileName: file.name
        }))
      );

      const newTicket = await ticketService.createTicket({
        ...formData,
        createdBy: user?.id,
        createdByName: formData.name,
        attachments: processedAttachments,
      });
      setSuccessData({
        id: newTicket.id,
        time: new Date().toLocaleString()
      });
      setTimeout(() => navigate('/tickets'), 5000);
    } catch (err) {
      setError('Failed to create ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-12">
        <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-green-500/20 animate-bounce">
          <CheckCircle2 size={48} className="text-white" />
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-6 text-ink">Ticket Raised Successfully!</h2>
        
        <div className="bg-white rounded-[2rem] border border-black/5 p-8 card-shadow max-w-lg w-full mb-8 space-y-4">
          <div className="flex justify-between items-center border-b border-black/5 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Ticket ID</span>
            <span className="text-sm font-black text-accent">{successData.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Submitted At</span>
            <span className="text-sm font-bold text-ink/60">{successData.time}</span>
          </div>
        </div>

        <p className="text-xl serif-italic text-ink/60 max-w-2xl mx-auto leading-relaxed">
          Your ticket has been submitted successfully. Our team is reviewing the issue and will keep you informed of any updates.
        </p>
        
        <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em] text-ink/20 animate-pulse">
          Redirecting to your tickets list...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex items-center gap-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-4 hover:bg-black/5 rounded-2xl transition-all text-ink/40"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-ink">Raise a ticket</h1>
          <p className="text-xl serif-italic text-ink/50">Report a campus issue or maintenance request.</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-black/5 p-12 card-shadow">
        {error && (
          <div className="mb-10 p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-3">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="text"
                  required
                  readOnly={!!user?.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={cn(
                    "w-full pl-14 pr-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium",
                    user?.name && "opacity-60 cursor-not-allowed"
                  )}
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="email"
                  required
                  readOnly={!!user?.email}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={cn(
                    "w-full pl-14 pr-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium",
                    user?.email && "opacity-60 cursor-not-allowed"
                  )}
                  placeholder="your.email@sliit.lk"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Faculty</label>
              <div className="relative group">
                <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
                <select
                  required
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium appearance-none"
                >
                  <option value="" disabled>Select Faculty</option>
                  <option value="Computing">Faculty of Computing</option>
                  <option value="Business">Faculty of Business</option>
                  <option value="Engineering">Faculty of Engineering</option>
                  <option value="Humanities">Faculty of Humanities & Sciences</option>
                  <option value="Graduate">Faculty of Graduate Studies</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Issue Title</label>
              <div className="relative group">
                <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium"
                  placeholder="Brief summary of the issue"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Location</label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium"
                  placeholder="e.g. Block A, Room 302"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Category</label>
              <div className="relative group">
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
                  className="w-full pl-14 pr-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium appearance-none"
                >
                  <option value="FACILITY">Facility / Maintenance</option>
                  <option value="IT">IT / Network</option>
                  <option value="ACADEMIC">Academic Support</option>
                  <option value="SECURITY">Security</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Priority</label>
            <div className="relative group">
              <AlertCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                className="w-full pl-14 pr-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium appearance-none"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Description</label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-6 py-5 bg-paper border border-black/5 rounded-[2rem] focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium leading-relaxed"
              placeholder="Describe the issue in detail..."
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Contact Details (Optional)</label>
            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
              <input
                type="text"
                value={formData.contactDetails}
                onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
                className="w-full pl-14 pr-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium"
                placeholder="Phone number or alternative email"
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Attachments (Max 3)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {previews.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-black/5 group">
                  <img src={url} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-black/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-black/5 hover:border-accent/20 transition-all text-ink/20 hover:text-accent">
                  <Upload size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
                  <input type="file" className="hidden" accept="image/jpeg,image/png" multiple onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <div className="pt-6 flex gap-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-5 bg-paper text-ink font-bold rounded-2xl hover:bg-black/5 transition-all duration-300 uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] py-5 bg-ink text-white rounded-2xl font-bold hover:bg-accent transition-all duration-500 shadow-2xl shadow-ink/10 disabled:opacity-50 flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Submit Ticket</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
