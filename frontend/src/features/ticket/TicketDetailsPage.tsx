import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Tag, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Send,
  UserPlus,
  CheckCircle,
  XCircle,
  Lock,
  ExternalLink,
  ChevronRight,
  Mail,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { ticketService } from './ticketService';
import { userService, User as Technician } from '../../shared/services/userService';
import { Ticket, TicketStatus } from './ticket';
import { TicketStatusBadge } from './TicketStatusBadge';
import { cn } from '../../lib/utils';

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true);
        const [ticketData, techData] = await Promise.all([
          ticketService.getTicketById(id),
          userService.getTechnicians()
        ]);
        if (ticketData) setTicket(ticketData);
        setTechnicians(techData);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !ticket || !user) return;

    setIsSubmitting(true);
    await ticketService.addComment(ticket.id, user.id, user.name, comment);
    setComment('');
    // Refresh ticket
    const updated = await ticketService.getTicketById(ticket.id);
    if (updated) setTicket(updated);
    setIsSubmitting(false);
  };

  const handleStatusUpdate = async (status: TicketStatus, reason?: string) => {
    if (!ticket) return;
    setIsSubmitting(true);
    await ticketService.updateStatus(ticket.id, status, reason);
    const updated = await ticketService.getTicketById(ticket.id);
    if (updated) setTicket(updated);
    setIsSubmitting(false);
    setShowResolveModal(false);
    setShowRejectModal(false);
    setNotes('');
  };

  const handleAssign = async (techId: string, techName: string) => {
    if (!ticket) return;
    setIsSubmitting(true);
    await ticketService.assignTechnician(ticket.id, techId, techName);
    const updated = await ticketService.getTicketById(ticket.id);
    if (updated) setTicket(updated);
    setIsSubmitting(false);
    setShowAssignModal(false);
  };

  if (isLoading) return <div className="p-20 text-center serif-italic text-ink/20">Loading ticket details...</div>;
  if (!ticket) return <div className="p-20 text-center serif-italic text-ink/20">Ticket not found.</div>;

  const canAssign = user?.role === 'ADMIN' && ticket.status === 'OPEN';
  const canResolve = user?.role === 'TECHNICIAN' && ticket.status === 'IN_PROGRESS' && ticket.assignedTo === user.id;
  const canClose = (user?.role === 'ADMIN' || (user?.role === 'USER' && ticket.createdBy === user.id)) && ticket.status === 'RESOLVED';
  const canReject = user?.role === 'ADMIN' && ticket.status === 'OPEN';

  const isCreator = user?.id === ticket.createdBy;
  const canUserResolve = isCreator && (ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS');
  const canUserUnresolve = isCreator && (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED');

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-4 hover:bg-black/5 rounded-2xl transition-all text-ink/40"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-lg">
                {ticket.id}
              </span>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-ink">{ticket.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {canAssign && (
            <button 
              onClick={() => setShowAssignModal(true)}
              className="px-6 py-3 bg-accent text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-accent/20"
            >
              <UserPlus size={16} /> Assign Technician
            </button>
          )}
          {(canResolve || canUserResolve) && (
            <button 
              onClick={() => setShowResolveModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-green-700 transition-all shadow-xl shadow-green-600/20"
            >
              <CheckCircle size={16} /> Mark as Resolved
            </button>
          )}
          {canUserUnresolve && (
            <button 
              onClick={() => handleStatusUpdate('OPEN', 'Marked as unresolved by creator')}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
            >
              <AlertCircle size={16} /> Mark as Unresolved
            </button>
          )}
          {canReject && (
            <button 
              onClick={() => setShowRejectModal(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
            >
              <XCircle size={16} /> Reject
            </button>
          )}
          {canClose && (
            <button 
              onClick={() => handleStatusUpdate('CLOSED')}
              className="px-6 py-3 bg-ink text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-ink/20"
            >
              <Lock size={16} /> Close Ticket
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Description Card */}
          <div className="bg-white rounded-[3rem] border border-black/5 p-10 card-shadow space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Description</h3>
              <p className="text-lg leading-relaxed text-ink/80">{ticket.description}</p>
            </div>

            {ticket.attachments && Array.isArray(ticket.attachments) && ticket.attachments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Attachments</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {ticket.attachments.map((att) => (
                    <a 
                      key={att.id} 
                      href={att.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-black/5 block"
                    >
                      <img src={att.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={att.fileName} />
                      <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink size={24} className="text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {ticket.resolutionNotes && (
              <div className="p-8 bg-green-50 rounded-3xl border border-green-100 space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">Resolution Notes</h3>
                <p className="text-green-900 font-medium">{ticket.resolutionNotes}</p>
              </div>
            )}

            {ticket.rejectionReason && (
              <div className="p-8 bg-red-50 rounded-3xl border border-red-100 space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-700">Rejection Reason</h3>
                <p className="text-red-900 font-medium">{ticket.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight px-4 flex items-center gap-3">
              <MessageSquare size={24} className="text-accent" /> Comments
            </h2>
            
            <div className="space-y-6">
              {(ticket.comments || []).map((c) => (
                <div key={c.id} className="bg-white rounded-[2rem] border border-black/5 p-8 card-shadow flex gap-6">
                  <div className="w-12 h-12 bg-paper rounded-2xl flex items-center justify-center shrink-0">
                    <User size={20} className="text-ink/20" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{c.userName}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ink/20">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-ink/70 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}

              <form onSubmit={handleAddComment} className="relative group">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-8 py-6 bg-white border border-black/5 rounded-[2.5rem] focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium leading-relaxed card-shadow pr-24"
                  rows={3}
                />
                <button 
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="absolute right-6 bottom-6 p-4 bg-ink text-white rounded-2xl hover:bg-accent transition-all duration-300 disabled:opacity-20"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-black/5 p-10 card-shadow space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-paper rounded-xl flex items-center justify-center text-accent shrink-0">
                  <Tag size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-0.5">Category</p>
                  <p className="text-sm font-bold">{ticket.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-paper rounded-xl flex items-center justify-center text-accent shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-0.5">Location</p>
                  <p className="text-sm font-bold">{ticket.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-paper rounded-xl flex items-center justify-center text-accent shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-0.5">Reported By</p>
                  <p className="text-sm font-bold">{ticket.createdByName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-paper rounded-xl flex items-center justify-center text-accent shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-0.5">Email Address</p>
                  <p className="text-sm font-bold">{ticket.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-paper rounded-xl flex items-center justify-center text-accent shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-0.5">Faculty</p>
                  <p className="text-sm font-bold">{ticket.faculty}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-paper rounded-xl flex items-center justify-center text-accent shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-0.5">Created On</p>
                  <p className="text-sm font-bold">{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-black/5 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-ink rounded-xl flex items-center justify-center text-white shrink-0">
                  <UserPlus size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-0.5">Assigned Technician</p>
                  <p className="text-sm font-bold">{ticket.assignedToName || 'Not Assigned'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full card-shadow space-y-10">
            <h2 className="text-3xl font-bold tracking-tight">Assign Technician</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {technicians.length > 0 ? (
                technicians.map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => handleAssign(tech.id, tech.name)}
                    className="w-full p-6 bg-paper rounded-2xl text-left font-bold hover:bg-accent hover:text-white transition-all flex items-center justify-between group"
                  >
                    <div className="flex flex-col">
                      <span>{tech.name}</span>
                      <span className="text-[10px] font-medium opacity-60">{tech.email}</span>
                    </div>
                    <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              ) : (
                <div className="p-12 text-center text-ink/20 serif-italic">
                  No technicians available.
                </div>
              )}
            </div>
            <button onClick={() => setShowAssignModal(false)} className="w-full py-4 text-ink/40 font-bold uppercase tracking-widest text-[10px]">Cancel</button>
          </div>
        </div>
      )}

      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full card-shadow space-y-10">
            <h2 className="text-3xl font-bold tracking-tight">Resolve Ticket</h2>
            <div className="space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Resolution Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-6 py-5 bg-paper border border-black/5 rounded-[2rem] focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium leading-relaxed"
                rows={4}
                placeholder="Describe how the issue was resolved..."
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowResolveModal(false)} className="flex-1 py-4 bg-paper rounded-2xl font-bold text-xs uppercase tracking-widest">Cancel</button>
              <button 
                onClick={() => handleStatusUpdate('RESOLVED', notes)}
                disabled={!notes.trim()}
                className="flex-[2] py-4 bg-green-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-green-700 transition-all disabled:opacity-50"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full card-shadow space-y-10">
            <h2 className="text-3xl font-bold tracking-tight text-red-600">Reject Ticket</h2>
            <div className="space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Rejection Reason</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-6 py-5 bg-paper border border-black/5 rounded-[2rem] focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all outline-none text-sm font-medium leading-relaxed"
                rows={4}
                placeholder="Provide a reason for rejection..."
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 py-4 bg-paper rounded-2xl font-bold text-xs uppercase tracking-widest">Cancel</button>
              <button 
                onClick={() => handleStatusUpdate('REJECTED', notes)}
                disabled={!notes.trim()}
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
