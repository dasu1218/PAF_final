import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { bookingService, Booking } from './bookingService';
import { useAuth } from '../../shared/context/AuthContext';
import { ConfirmModal } from '../../shared/components/ConfirmModal';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'>('ALL');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [bookingsData, resourcesData] = await Promise.all([
          bookingService.getBookings(user.id),
          bookingService.getResources()
        ]);
        
        // Enrich bookings with names for display
        const enriched = bookingsData.map(b => {
          const res = resourcesData.find(r => r.id === b.resourceId);
          // Simple fallback for old records using their creation date
          const fallbackDate = b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Date Pending';
          
          return {
            ...b,
            resourceName: b.resourceName || res?.name || b.resourceId,
            date: b.date || fallbackDate,
            timeSlot: b.timeSlot || 'Not Specified'
          } as Booking;
        });

        setBookings(enriched);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [user]);

  const filteredBookings = bookings.filter(b => 
    filter === 'ALL' || b.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 className="text-green-500" size={18} />;
      case 'REJECTED': return <XCircle className="text-red-500" size={18} />;
      case 'CANCELLED': return <XCircle className="text-gray-400" size={18} />;
      default: return <AlertCircle className="text-orange-500" size={18} />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'APPROVED': return "bg-green-50 text-green-700 border-green-100";
      case 'REJECTED': return "bg-red-50 text-red-700 border-red-100";
      case 'CANCELLED': return "bg-gray-50 text-gray-500 border-gray-100";
      default: return "bg-orange-50 text-orange-700 border-orange-100";
    }
  };

  const handleCancelClick = (id: string) => {
    setBookingToCancel(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = async (reason?: string) => {
    if (bookingToCancel && user && reason) {
      try {
        await bookingService.cancelBooking(bookingToCancel, user.id, reason);
        setBookings(prev => prev.map(b => 
          b.id === bookingToCancel ? { ...b, status: 'CANCELLED' as any } : b
        ));
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      } finally {
        setBookingToCancel(null);
      }
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-ink">My Bookings</h1>
          <p className="text-xl serif-italic text-ink/50">Track the status of your facility reservation requests.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-black/5 w-fit card-shadow">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
              filter === f 
                ? "bg-ink text-white shadow-xl shadow-ink/20" 
                : "text-ink/30 hover:text-ink hover:bg-black/5"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-card rounded-[3rem] border border-border animate-pulse" />
          ))
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-card rounded-[2.5rem] border border-border p-8 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group relative overflow-hidden">
              <div className="p-10 flex-1">
                <div className="flex items-start justify-between mb-8">
                  <div className="space-y-1">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                      getStatusStyles(booking.status)
                    )}>
                      {booking.status}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight mt-4 text-ink group-hover:text-accent transition-colors duration-500">
                      {(booking.resourceName || 'Facility') + ' Booking'}
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-paper rounded-2xl flex items-center justify-center text-ink/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <Calendar size={24} />
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/20">Description / Purpose</p>
                  <p className="text-sm font-medium text-ink/60 leading-relaxed bg-black/[0.02] p-4 rounded-2xl border border-black/5">
                    {booking.purpose || 'No description provided.'}
                  </p>
                </div>

                  {booking.rejectionReason && (
                    <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100/50">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 mb-2">Rejection Reason</p>
                      <p className="text-sm text-red-700 serif-italic font-medium leading-relaxed">"{booking.rejectionReason}"</p>
                    </div>
                  )}

                  {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                    <button 
                      onClick={() => handleCancelClick(booking.id)}
                      className="mt-6 w-full py-4 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border border-red-100 hover:border-red-500"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>

              <div className="px-10 py-6 bg-black/[0.02] border-t border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">ID: {booking.id.slice(-8)}</span>
                </div>
                <div className="flex items-center gap-2 text-ink/30">
                   {getStatusIcon(booking.status)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border border-black/5 shadow-inner">
            <div className="w-24 h-24 bg-paper rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/5 ring-1 ring-black/5">
              <Calendar className="text-ink/10" size={48} />
            </div>
            <h3 className="text-3xl font-bold text-ink mb-3 uppercase tracking-tight">No Bookings Found</h3>
            <p className="text-xl serif-italic text-ink/30 max-w-md mx-auto">You haven't made any facility requests yet.</p>
            <button 
              onClick={() => window.location.href = '/bookings'}
              className="mt-10 px-8 py-4 bg-ink text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-all duration-500 shadow-xl shadow-ink/20"
            >
              Book a Facility
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking?"
        message="Please provide a reason for cancelling this booking. This will help administrators manage campus resources more effectively."
        hasInput={true}
        inputPlaceholder="e.g. Event postponed, found better venue..."
        confirmText="Cancel Booking"
      />
    </div>
  );
};
