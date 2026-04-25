import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  User, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Play, 
  AlertCircle,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { technicianService } from './technicianService';
import { Ticket, TicketStatus } from './ticket';
import { TicketStatusBadge } from './TicketStatusBadge';
import { cn } from '../../lib/utils';

export const TechnicianTicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await technicianService.getTicketById(id);
        setTicket(data);
        setResolutionNotes(data.resolutionNotes || '');
      } catch (error) {
        console.error('Failed to fetch ticket details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleStatusUpdate = async (newStatus: TicketStatus) => {
    if (!id || !ticket) return;
    setIsSubmitting(true);
    try {
      const updatedTicket = await technicianService.updateTicketStatus(id, newStatus, resolutionNotes);
      setTicket(updatedTicket);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !comment.trim()) return;
    setIsSubmitting(true);
    try {
      await technicianService.addComment(id, comment);
      setComment('');
      // Refresh ticket to show new comment
      const updatedTicket = await technicianService.getTicketById(id);
      setTicket(updatedTicket);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 animate-pulse space-y-8">
        <div className="h-12 w-48 bg-white/50 rounded-2xl" />
        <div className="h-64 bg-white/50 rounded-[3rem]" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold text-ink">Ticket not found</h2>
        <button onClick={() => navigate('/technician/tickets')} className="mt-4 text-accent font-bold">Back to My Tickets</button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <button 
        onClick={() => navigate('/technician/tickets')}
        className="flex items-center gap-2 text-ink/40 hover:text-ink transition-colors font-bold uppercase tracking-widest text-[11px]"
      >
        <ArrowLeft size={16} /> Back to My Tickets
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white rounded-[3rem] border border-black/5 p-10 shadow-sm space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-lg">
                  {ticket.id}
                </span>
                <TicketStatusBadge status={ticket.status} />
              </div>
              <div className="flex items-center gap-4 text-sm text-ink/40">
                <span className="flex items-center gap-2"><Clock size={16} /> {new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-ink">{ticket.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-ink/60">
                <span className="flex items-center gap-2 bg-paper px-4 py-2 rounded-xl"><MapPin size={16} className="text-accent" /> {ticket.location}</span>
                <span className="flex items-center gap-2 bg-paper px-4 py-2 rounded-xl"><User size={16} className="text-accent" /> {ticket.createdByName}</span>
              </div>
            </div>

            <div className="prose prose-ink max-w-none">
              <p className="text-lg leading-relaxed text-ink/70">{ticket.description}</p>
            </div>

            {ticket.attachments && Array.isArray(ticket.attachments) && ticket.attachments.length > 0 && (
              <div className="space-y-4 pt-8 border-t border-black/5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-ink/30 flex items-center gap-2">
                  <ImageIcon size={16} /> Attachments
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ticket.attachments.map((att) => (
                    <a 
                      key={att.id} 
                      href={att.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative aspect-video rounded-2xl overflow-hidden border border-black/5"
                    >
                      <img src={att.url} alt={att.fileName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">View Full Size</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-[3rem] border border-black/5 p-10 shadow-sm space-y-8">
            <h3 className="text-xl font-bold tracking-tight flex items-center gap-3">
              <MessageSquare size={24} className="text-accent" /> Comments
            </h3>

            <div className="space-y-8">
              {ticket.comments.map((c) => (
                <div key={c.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center text-accent font-bold shrink-0">
                    {c.userName.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{c.userName}</span>
                      <span className="text-[10px] font-bold text-ink/20 uppercase tracking-widest">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-ink/60 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}

              <form onSubmit={handleAddComment} className="relative pt-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-6 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium resize-none h-32"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="absolute bottom-6 right-6 bg-accent text-white p-3 rounded-xl hover:bg-ink transition-all disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <div className="bg-ink rounded-[2.5rem] p-10 text-white shadow-2xl shadow-ink/20 space-y-8">
            <h3 className="text-xl font-bold tracking-tight">Update Status</h3>
            
            <div className="space-y-4">
              {ticket.status === 'OPEN' && (
                <button 
                  onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-accent text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-white hover:text-ink transition-all"
                >
                  <Play size={18} /> Start Work
                </button>
              )}

              {ticket.status === 'IN_PROGRESS' && (
                <button 
                  onClick={() => handleStatusUpdate('RESOLVED')}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-white hover:text-ink transition-all"
                >
                  <CheckCircle2 size={18} /> Mark as Resolved
                </button>
              )}

              {ticket.status === 'RESOLVED' && (
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-400" />
                  <span className="text-sm font-bold">Ticket Resolved</span>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-8 border-t border-white/10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Resolution Notes</h4>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Add resolution details..."
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium outline-none focus:border-accent transition-all h-32 resize-none"
              />
              <button 
                onClick={() => handleStatusUpdate(ticket.status)}
                disabled={isSubmitting}
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold transition-all"
              >
                Save Notes
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-black/5 p-10 card-shadow space-y-6">
            <h3 className="text-lg font-bold tracking-tight">Ticket Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-ink/40 font-bold uppercase tracking-widest">Priority</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md",
                  ticket.priority === 'HIGH' ? 'text-red-500 bg-red-50' : 
                  ticket.priority === 'MEDIUM' ? 'text-yellow-600 bg-yellow-50' : 
                  'text-green-500 bg-green-50'
                )}>
                  {ticket.priority}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-ink/40 font-bold uppercase tracking-widest">Category</span>
                <span className="text-xs font-bold">{ticket.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-ink/40 font-bold uppercase tracking-widest">Faculty</span>
                <span className="text-xs font-bold">{ticket.faculty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
