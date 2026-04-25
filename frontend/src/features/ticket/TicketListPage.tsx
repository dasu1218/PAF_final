import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, Filter, ChevronRight, Clock, AlertCircle, CheckCircle2, MoreHorizontal, Ticket as TicketIcon, GraduationCap } from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { ticketService } from './ticketService';
import { Ticket, TicketStatus, TicketPriority } from './ticket';
import { TicketStatusBadge } from './TicketStatusBadge';
import { cn } from '../../lib/utils';

export const TicketListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const queryParams = new URLSearchParams(location.search);
  const [showOnlyMine, setShowOnlyMine] = useState(queryParams.get('filter') === 'mine');

  useEffect(() => {
    const fetchTickets = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const data = await ticketService.getTickets(user.role, user.id);
          setTickets(data);
        } catch (error) {
          console.error('Failed to fetch tickets:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchTickets();
  }, [user]);

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === 'ALL' || t.status === filter;
    const matchesSearch = (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMine = !showOnlyMine || t.createdBy === user?.id;
    return matchesFilter && matchesSearch && matchesMine;
  });

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-500';
      case 'MEDIUM': return 'text-orange-500';
      case 'LOW': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-ink">Support Tickets</h1>
          <p className="text-xl serif-italic text-ink/50">Report issues and track maintenance progress across campus.</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setShowOnlyMine(!showOnlyMine)}
            className={cn(
              "px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 border shadow-2xl shadow-ink/10",
              showOnlyMine 
                ? "bg-accent text-white border-accent" 
                : "bg-card text-ink border-border hover:border-ink/20"
            )}
          >
            <TicketIcon size={20} /> My Tickets
          </button>
          <button 
            onClick={() => navigate('create')}
            className="bg-ink text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-accent transition-all duration-300 shadow-2xl shadow-ink/10"
          >
            <Plus size={20} /> Raise Ticket
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map((s) => (
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
            placeholder="Search by ID or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-card border border-border rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-card/50 animate-pulse rounded-[2.5rem] border border-border" />
          ))}
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket.id}
              onClick={() => navigate(ticket.id)}
              className="bg-card rounded-[2.5rem] border border-border p-8 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group cursor-pointer card-shadow flex flex-col md:flex-row md:items-center gap-8"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-lg">
                    {ticket.id}
                  </span>
                  <TicketStatusBadge status={ticket.status} />
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5", getPriorityColor(ticket.priority))}>
                    <AlertCircle size={12} /> {ticket.priority} Priority
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-ink mb-2 tracking-tight group-hover:text-accent transition-colors">
                  {ticket.title}
                </h3>
                <div className="flex flex-wrap items-center gap-6 text-sm text-ink/40">
                  <span className="flex items-center gap-2">
                    <Clock size={16} /> {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2">
                    <Filter size={16} /> {ticket.category}
                  </span>
                  <span className="flex items-center gap-2">
                    <GraduationCap size={16} /> {ticket.faculty}
                  </span>
                  <span className="flex items-center gap-2 font-medium text-ink/60">
                    Location: {ticket.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-black/5 pt-6 md:pt-0 md:pl-8">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-1">Assigned To</p>
                  <p className="text-sm font-bold">{ticket.assignedToName || 'Unassigned'}</p>
                </div>
                <div className="w-12 h-12 bg-paper rounded-2xl flex items-center justify-center text-ink/20 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <ChevronRight size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-20 bg-card/50 rounded-[3rem] border border-dashed border-border text-center">
          <div className="w-20 h-20 bg-card rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5">
            <TicketIcon className="text-ink/10" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-ink mb-2">No tickets found</h3>
          <p className="text-ink/40 serif-italic">Try adjusting your filters or create a new ticket.</p>
        </div>
      )}
    </div>
  );
};
