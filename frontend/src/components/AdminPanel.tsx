import React, { useState, useEffect } from 'react';
import { Resource } from '../types/Resource';
import { BookingResponse } from '../types/Booking';
import { resourceApi } from '../api/resourceApi';
import { bookingApi } from '../api/bookingApi';
import { ResourceForm } from './ResourceForm';
import { TicketCatalogue } from './TicketCatalogue';
import { Plus, Edit2, Trash2, ShieldCheck, CircleAlert, Database, Check, X, Clock, Calendar, AlertCircle, Users, Ticket } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBooksLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'resources' | 'bookings' | 'tickets'>('resources');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [selectedBookingForReject, setSelectedBookingForReject] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [userId, setUserId] = useState('');
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const storedAdminId = localStorage.getItem('userId') || sessionStorage.getItem('userId') || 'admin-user';
    const storedUser = localStorage.getItem('resource-app-user');
    setAdminId(storedAdminId);
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAdminName(user.name || 'Admin');
      } catch {
        setAdminName('Admin');
      }
    }
  }, []);

  const loadResources = async () => {
    try {
      const data = await resourceApi.getAll();
      setResources(data);
    } catch (error) {
      console.error('Failed to load resources', error);
    }
  };

  const loadBookings = async () => {
    try {
      setBooksLoading(true);
      const data = await bookingApi.getAll();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings', error);
    } finally {
      setBooksLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadResources(), loadBookings()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadBookings();
    }
  }, [activeTab]);

  const handleAdd = () => {
    setEditingId(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setResourceToDelete(id);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;
    try {
      await resourceApi.delete(resourceToDelete);
      loadResources();
    } catch (error) {
      console.error('Failed to delete resource', error);
    } finally {
      setResourceToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    loadResources();
  };

  const handleApproveBooking = async (bookingId: string) => {
    try {
      await bookingApi.approve(bookingId, adminId);
      await loadBookings();
    } catch (error) {
      console.error('Failed to approve booking', error);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      await bookingApi.reject(bookingId, rejectionReason || 'No reason provided');
      await loadBookings();
      setSelectedBookingForReject(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject booking', error);
    }
  };

  if (isFormOpen) {
    return (
      <ResourceForm 
        resourceId={editingId} 
        onSuccess={handleFormSuccess} 
        onCancel={() => setIsFormOpen(false)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors duration-300">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              <ShieldCheck className="h-3.5 w-3.5 text-[#F27D26]" />
              Admin workspace
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {activeTab === 'resources' ? 'Resource management' : activeTab === 'bookings' ? 'Booking approvals' : 'Maintenance tickets'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary sm:text-base">
              {activeTab === 'resources' 
                ? 'Add, update, or remove resources from one focused table view.'
                : activeTab === 'bookings'
                ? 'Review and approve or reject booking requests from students.'
                : 'Monitor and manage maintenance and incident tickets from users.'}
            </p>
          </div>

          {activeTab === 'resources' && (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 rounded-full bg-[#F27D26] px-5 py-3 font-medium text-white shadow-lg shadow-[#F27D26]/25 transition hover:-translate-y-0.5 hover:bg-[#ff9548]"
            >
              <Plus className="h-5 w-5" />
              Add Resource
            </button>
          )}
        </div>

        <div className="mt-6 flex gap-2 border-b border-border/70">
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'resources'
                ? 'border-b-2 border-[#F27D26] text-[#F27D26]'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'bookings'
                ? 'border-b-2 border-[#F27D26] text-[#F27D26]'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Bookings
            {bookings.filter(b => b.status === 'PENDING').length > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {bookings.filter(b => b.status === 'PENDING').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'tickets'
                ? 'border-b-2 border-[#F27D26] text-[#F27D26]'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <Ticket className="h-4 w-4" />
            Tickets
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {activeTab === 'resources' ? (
            <>
              <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Total resources</p>
                <p className="mt-1 font-display text-2xl font-semibold text-primary">{resources.length}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Active</p>
                <p className="mt-1 font-display text-2xl font-semibold text-primary">{resources.filter(r => r.status === 'ACTIVE').length}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Attention</p>
                <p className="mt-1 font-display text-2xl font-semibold text-primary">{resources.filter(r => r.status !== 'ACTIVE').length}</p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Total bookings</p>
                <p className="mt-1 font-display text-2xl font-semibold text-primary">{bookings.length}</p>
              </div>
              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-yellow-600">Pending</p>
                <p className="mt-1 font-display text-2xl font-semibold text-yellow-600">{bookings.filter(b => b.status === 'PENDING').length}</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">Approved</p>
                <p className="mt-1 font-display text-2xl font-semibold text-emerald-600">{bookings.filter(b => b.status === 'APPROVED').length}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors duration-300">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#F27D26]/20 border-t-[#F27D26]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border/70 bg-background/70 text-xs uppercase tracking-[0.28em] text-secondary transition-colors duration-300">
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {resources.map(resource => (
                    <tr key={resource.id} className="transition-colors hover:bg-input/60">
                      <td className="px-6 py-5 font-medium text-primary">{resource.name}</td>
                      <td className="px-6 py-5 text-muted">{resource.type}</td>
                      <td className="px-6 py-5 text-muted">{resource.location}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${
                          resource.status === 'ACTIVE'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {resource.status ? resource.status.replace('_', ' ') : 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(resource.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70 text-secondary transition hover:-translate-y-0.5 hover:text-primary hover:shadow-md"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(resource.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70 text-secondary transition hover:-translate-y-0.5 hover:text-red-500 hover:shadow-md"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {resources.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-secondary">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F27D26]/10 text-[#F27D26]">
                          <Database className="h-6 w-6" />
                        </div>
                        <p className="mt-4 font-display text-xl font-semibold text-primary">No resources found</p>
                        <p className="mt-2 text-sm">Use the Add Resource button to create the first entry.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookingsLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#F27D26]/20 border-t-[#F27D26]" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-border/70 bg-surface/60 py-16 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F27D26]/10 text-[#F27D26]">
                <Calendar className="h-6 w-6" />
              </div>
              <p className="mt-4 font-display text-xl font-semibold text-primary">No bookings yet</p>
              <p className="mt-2 text-sm text-secondary">Bookings from students will appear here.</p>
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-surface/80 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-[#F27D26]/40 hover:shadow-[0_24px_60px_rgba(242,125,38,0.12)]">
                <div className={`h-1 ${
                  booking.status === 'PENDING' ? 'bg-yellow-500' :
                  booking.status === 'APPROVED' ? 'bg-emerald-500' :
                  booking.status === 'REJECTED' ? 'bg-red-500' :
                  'bg-gray-500'
                }`} />
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-display text-xl font-semibold text-primary">{booking.purpose}</h3>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${
                          booking.status === 'PENDING' ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-600' :
                          booking.status === 'APPROVED' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600' :
                          booking.status === 'REJECTED' ? 'border-red-500/20 bg-red-500/10 text-red-600' :
                          'border-gray-500/20 bg-gray-500/10 text-gray-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-secondary">User ID: {booking.userId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-background/60">
                      <Calendar className="h-4 w-4 text-[#F27D26]" />
                      <div>
                        <p className="text-xs text-muted">Date & Time</p>
                        <p className="text-primary font-medium">
                          {new Date(booking.startTime).toLocaleDateString()} {new Date(booking.startTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-background/60">
                      <Clock className="h-4 w-4 text-[#F27D26]" />
                      <div>
                        <p className="text-xs text-muted">Duration</p>
                        <p className="text-primary font-medium">
                          {Math.round((new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60))} min
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-background/60">
                    <Users className="h-4 w-4 text-[#F27D26]" />
                    <div>
                      <p className="text-xs text-muted">Expected Attendees</p>
                      <p className="text-primary font-medium">{booking.expectedAttendees}</p>
                    </div>
                  </div>

                  {booking.rejectionReason && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-red-600 font-semibold">Rejection Reason</p>
                        <p className="text-sm text-red-700">{booking.rejectionReason}</p>
                      </div>
                    </div>
                  )}

                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => handleApproveBooking(booking.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 font-medium text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-600"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBookingForReject(booking.id);
                          setRejectionReason('');
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2.5 font-medium text-red-500 transition hover:bg-red-500/20"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}

                  {selectedBookingForReject === booking.id && (
                    <div className="space-y-3 p-4 rounded-lg bg-red-50 border border-red-200">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a reason for rejection..."
                        rows={2}
                        className="w-full p-2 rounded border border-red-300 text-sm outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedBookingForReject(null);
                            setRejectionReason('');
                          }}
                          className="flex-1 px-3 py-2 rounded border border-red-300 text-sm font-medium text-red-700 hover:bg-red-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRejectBooking(booking.id)}
                          className="flex-1 px-3 py-2 rounded bg-red-500 text-sm font-medium text-white hover:bg-red-600"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <TicketCatalogue
          userId={adminId}
          userName={adminName}
          userRole="ADMIN"
        />
      )}

      {/* Custom Confirmation Modal */}
      {resourceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.75rem] border border-border/70 bg-surface/90 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.24)] backdrop-blur-xl transition-colors duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <CircleAlert className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-primary">Confirm deletion</h3>
            <p className="mt-2 text-secondary">Are you sure you want to delete this resource? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setResourceToDelete(null)}
                className="rounded-full border border-border/70 bg-background/70 px-4 py-2.5 text-sm font-medium text-muted transition hover:text-primary hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
