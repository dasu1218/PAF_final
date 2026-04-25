import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Calendar,
  User,
  Clock,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { bookingService, Booking, BookingStatus } from './bookingService';
import { userService } from '../../shared/services/userService';
import { useAuth } from '../../shared/context/AuthContext';

export const BookingManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [bookingsData, resourcesData, usersData] = await Promise.all([
          bookingService.getBookings(),
          bookingService.getResources(),
          userService.getAllUsers()
        ]);
        
        // Map missing names and roles for legacy bookings
        const enrichedBookings = bookingsData.map(b => {
          const res = resourcesData.find(r => r.id === b.resourceId);
          const usr = usersData.find(u => u.id === b.userId);
          
          return { 
            ...b, 
            resourceName: b.resourceName || res?.name || b.resourceId,
            resourceType: (b as any).resourceType || res?.type || 'FACILITY',
            userName: b.userName || usr?.name || b.userId,
            userRole: b.userRole || usr?.role || 'STUDENT'
          } as Booking;
        });

        setBookings(enrichedBookings);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    await bookingService.approveBooking(id, user?.email, user?.name);
    const data = await bookingService.getBookings();
    setBookings([...data]);
  };

  const handleReject = async (id: string) => {
    await bookingService.rejectBooking(id, rejectionReason, user?.email, user?.name);
    const data = await bookingService.getBookings();
    setBookings([...data]);
    setShowRejectModal(null);
    setRejectionReason('');
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'ALL' || b.status === filter;
    const matchesSearch = (b.resourceName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (b.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-50 text-green-600 border-green-100';
      case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100';
      case 'PENDING': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'CANCELLED': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-ink">Booking Management</h1>
          <p className="text-xl serif-italic text-ink/50">Approve or reject campus facility booking requests.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border",
                filter === s 
                  ? "bg-accent text-white border-accent shadow-xl shadow-accent/20" 
                  : "bg-card text-ink/40 border-border hover:border-ink/20 hover:text-ink"
              )}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by ID, user or resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-card border border-border rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-[3rem] border border-border overflow-hidden card-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink/[0.02] border-b border-border">
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Request</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Resource</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">User</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Date & Time</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Status</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="group hover:bg-ink/[0.01] transition-colors">
                <td className="px-8 py-6">
                  <div>
                    <p className="font-bold text-ink">{booking.purpose}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/20">{booking.id}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-ink/60">
                      <Calendar size={14} className="text-accent" />
                      <span className="text-sm font-bold">{booking.resourceName || booking.resourceId}</span>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-ink/30 pl-5">{(booking as any).resourceType?.replace('_', ' ') || 'FACILITY'}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-ink/60">
                      <User size={14} />
                      <span className="text-sm font-medium">{booking.userName || booking.userId}</span>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-ink/30 pl-5">{booking.userRole || 'STUDENT'}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-ink/60">
                      <Clock size={14} />
                      <span className="text-xs font-bold">{booking.date || 'Date Pending'}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 pl-5">{booking.timeSlot || 'Time Pending'}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                    getStatusStyle(booking.status)
                  )}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  {booking.status === 'PENDING' ? (
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleApprove(booking.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => setShowRejectModal(booking.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button className="p-3 hover:bg-black/5 rounded-xl transition-all text-ink/20">
                      <ChevronRight size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredBookings.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-paper rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-ink/10" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-ink mb-2">No bookings found</h3>
            <p className="text-ink/40 serif-italic">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm">
          <div className="bg-card rounded-[3rem] p-12 max-w-md w-full card-shadow space-y-10">
            <h2 className="text-3xl font-bold tracking-tight text-red-600">Reject Booking</h2>
            <div className="space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-6 py-5 bg-paper border border-border rounded-[2rem] focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all outline-none text-sm font-medium leading-relaxed"
                rows={4}
                placeholder="Provide a reason for rejection..."
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowRejectModal(null)} className="flex-1 py-4 bg-paper rounded-2xl font-bold text-xs uppercase tracking-widest">Cancel</button>
              <button 
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectionReason.trim()}
                className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
