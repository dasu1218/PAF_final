import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronRight,
  Plus,
  CheckCircle2,
  Settings,
  Building,
  GraduationCap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { bookingService, Resource, ResourceType } from './bookingService';
import { useAuth } from '../../shared/context/AuthContext';
import { toast } from 'sonner';

export const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'ALL'>('ALL');
  const [facultyFilter, setFacultyFilter] = useState<string>('ALL');
  const [buildingFilter, setBuildingFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      const data = await bookingService.getResources();
      setResources(data);
      setIsLoading(false);
    };
    fetchResources();
  }, []);

  const faculties = ['ALL', ...new Set(resources.map(r => r.faculty))];
  const buildings = ['ALL', ...new Set(resources.map(r => r.building))];

  const filteredResources = resources.filter(r => {
    const matchesType = typeFilter === 'ALL' || r.type === typeFilter;
    const matchesFaculty = facultyFilter === 'ALL' || r.faculty === facultyFilter;
    const matchesBuilding = buildingFilter === 'ALL' || r.building === buildingFilter;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesFaculty && matchesBuilding && matchesSearch;
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource || !user) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const bookingData = {
      resourceId: selectedResource.id,
      resourceName: selectedResource.name,
      userId: user.id,
      userName: user.name,
      userRole: user.role as any,
      date: formData.get('date') as string,
      timeSlot: formData.get('timeSlot') as string,
      purpose: formData.get('purpose') as string,
      attendees: parseInt(formData.get('attendees') as string) || 1,
    };

    await bookingService.createBooking(bookingData);
    setBookingSuccess(true);
    toast.success('Booking request submitted successfully!');
    setTimeout(() => {
      setBookingSuccess(false);
      setShowForm(false);
      setSelectedResource(null);
    }, 3000);
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-ink">Resource Booking</h1>
          <p className="text-xl serif-italic text-ink/50">Find and reserve campus facilities for your academic activities.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 bg-card border border-border rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium w-64"
            />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-card rounded-[2.5rem] border border-border p-8 card-shadow space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Type Filter */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Resource Type</label>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'LECTURE_HALL', 'LAB', 'EQUIPMENT'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-300 border",
                    typeFilter === t 
                      ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                      : "bg-paper text-ink/40 border-transparent hover:border-ink/10"
                  )}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Faculty Filter */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Faculty</label>
            <select 
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="w-full px-4 py-3 bg-paper border border-transparent rounded-xl text-sm font-bold outline-none focus:border-accent transition-all"
            >
              {faculties.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Building Filter */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Building</label>
            <select 
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="w-full px-4 py-3 bg-paper border border-transparent rounded-xl text-sm font-bold outline-none focus:border-accent transition-all"
            >
              {buildings.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 bg-white/50 animate-pulse rounded-[2.5rem] border border-black/5" />
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredResources.map((res) => (
            <div 
              key={res.id} 
              className="bg-card rounded-[2.5rem] border border-border p-8 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group relative overflow-hidden card-shadow flex flex-col"
            >
              <div className="absolute top-0 right-0 p-8">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border",
                  res.status === 'ACTIVE' || res.status === 'AVAILABLE' ? "bg-green-50 text-green-700 border-green-100" : 
                  res.status === 'MAINTENANCE' ? "bg-orange-50 text-orange-700 border-orange-100" : 
                  "bg-red-50 text-red-700 border-red-100"
                )}>
                  {res.status === 'ACTIVE' ? 'AVAILABLE' : res.status === 'OUT_OF_SERVICE' ? 'UNAVAILABLE' : res.status}
                </span>
              </div>

              <div className="w-16 h-16 bg-paper rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                {res.type === 'LECTURE_HALL' ? <Users size={24} /> : 
                 res.type === 'LAB' ? <Settings size={24} /> : 
                 <Settings size={24} />}
              </div>

              <h3 className="text-2xl font-bold text-ink mb-2 tracking-tight">{res.name}</h3>
              <p className="text-sm text-ink/40 mb-6 line-clamp-2">{res.description}</p>
              
              <div className="space-y-4 mb-10 flex-1">
                <div className="flex items-center gap-3 text-sm text-ink/40">
                  <Building size={18} className="text-accent/40" />
                  <span className="font-medium">{res.building}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-ink/40">
                  <GraduationCap size={18} className="text-accent/40" />
                  <span className="font-medium">{res.faculty} Faculty</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-ink/40">
                  <Users size={18} className="text-accent/40" />
                  <span className="font-medium">Capacity: {res.capacity} persons</span>
                </div>
              </div>

              <button
                disabled={res.status !== 'ACTIVE' && res.status !== 'AVAILABLE'}
                onClick={() => {
                  setSelectedResource(res);
                  setShowForm(true);
                }}
                className="w-full py-4 bg-paper text-ink font-bold rounded-2xl hover:bg-ink hover:text-white transition-all duration-300 disabled:opacity-30 disabled:hover:bg-paper disabled:hover:text-ink flex items-center justify-center gap-3"
              >
                Book Now <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-20 bg-white/50 rounded-[3rem] border border-dashed border-black/10 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5">
            <Search className="text-ink/10" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-ink mb-2">No resources found</h3>
          <p className="text-ink/40 serif-italic">Try adjusting your filters or search query.</p>
        </div>
      )}

      {/* Booking Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-xl rounded-[3rem] shadow-2xl p-12 border border-border relative overflow-hidden">
            {bookingSuccess ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-green-500/20 animate-bounce">
                  <CheckCircle2 size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Booking Request Sent!</h2>
                <p className="text-ink/50 serif-italic">Your request has been submitted to the admin for approval.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">New Booking</h2>
                    <p className="text-ink/40 text-sm mt-1">Reserve {selectedResource?.name}</p>
                  </div>
                  <button onClick={() => setShowForm(false)} className="p-4 hover:bg-black/5 rounded-2xl transition-all text-ink/20">
                    <X size={24} />
                  </button>
                </div>

                <form className="space-y-8" onSubmit={handleBookingSubmit}>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Date</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20" size={18} />
                        <input name="date" type="date" required className="w-full pl-14 pr-6 py-4 bg-paper border border-transparent rounded-2xl text-sm font-bold outline-none focus:border-accent transition-all" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Time Slot</label>
                      <div className="relative">
                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20" size={18} />
                        <select name="timeSlot" required className="w-full pl-14 pr-6 py-4 bg-paper border border-transparent rounded-2xl text-sm font-bold outline-none focus:border-accent transition-all appearance-none cursor-pointer">
                          <option value="">Select Time</option>
                          <option value="08:00 - 10:00">08:00 - 10:00</option>
                          <option value="10:00 - 12:00">10:00 - 12:00</option>
                          <option value="12:00 - 14:00">12:00 - 14:00</option>
                          <option value="14:00 - 16:00">14:00 - 16:00</option>
                          <option value="16:00 - 18:00">16:00 - 18:00</option>
                          <option value="18:00 - 20:00">18:00 - 20:00</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Attendees</label>
                    <div className="relative">
                      <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20" size={18} />
                      <input name="attendees" type="number" required min="1" max={selectedResource?.capacity} className="w-full pl-14 pr-6 py-4 bg-paper border border-transparent rounded-2xl text-sm font-bold outline-none focus:border-accent transition-all" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Purpose</label>
                    <textarea 
                      name="purpose"
                      rows={3} 
                      required
                      className="w-full px-6 py-5 bg-paper border border-transparent rounded-[2rem] text-sm font-bold outline-none focus:border-accent transition-all resize-none"
                      placeholder="Describe the purpose of your booking..."
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full py-5 bg-ink text-white rounded-2xl font-bold hover:bg-accent transition-all shadow-2xl shadow-ink/10">
                    Confirm Reservation
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
