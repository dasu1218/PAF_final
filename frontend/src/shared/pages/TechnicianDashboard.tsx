import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { technicianService } from '../../features/ticket/technicianService';
import { Ticket as TicketType } from '../../features/ticket/ticket';
import { cn } from '../../lib/utils';
import { TicketStatusBadge } from '../../features/ticket/TicketStatusBadge';

export const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const data = await technicianService.getAssignedTickets(user.id);
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch assigned tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS');
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED');

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <Wrench size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-ink">Technician Console</h1>
          <p className="text-xl serif-italic text-ink/50">Welcome back, {user?.name}. Here's an overview of your maintenance tasks.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          label="Total Assigned" 
          value={tickets.length.toString()} 
          icon={<Ticket size={24} />} 
          trend="Lifetime tasks"
          color="blue"
        />
        <StatCard 
          label="In Progress" 
          value={inProgressTickets.length.toString()} 
          icon={<Clock size={24} />} 
          trend="Active now"
          color="orange"
        />
        <StatCard 
          label="Resolved" 
          value={resolvedTickets.length.toString()} 
          icon={<CheckCircle2 size={24} />} 
          trend="Completed tasks"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Assignments */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Active Assignments</h2>
            <button 
              onClick={() => navigate('/technician/tickets')} 
              className="text-[11px] font-bold uppercase tracking-widest text-accent hover:underline flex items-center gap-2"
            >
              View My Tickets <ArrowUpRight size={14} />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white/50 animate-pulse rounded-3xl border border-black/5" />
              ))}
            </div>
          ) : tickets.filter(t => t.status !== 'RESOLVED').length > 0 ? (
            <div className="space-y-4">
              {tickets.filter(t => t.status !== 'RESOLVED').slice(0, 5).map((ticket) => (
                <div 
                  key={ticket.id}
                  onClick={() => navigate(`/technician/tickets/${ticket.id}`)}
                  className="bg-card rounded-[2rem] border border-border p-6 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group cursor-pointer flex items-center gap-6"
                >
                  <div className="w-12 h-12 bg-paper rounded-2xl flex items-center justify-center text-ink/20 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                    <Ticket size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30">{ticket.id}</span>
                      <TicketStatusBadge status={ticket.status} />
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                        ticket.priority === 'HIGH' ? 'text-red-500 bg-red-50' : 
                        ticket.priority === 'MEDIUM' ? 'text-yellow-600 bg-yellow-50' : 
                        'text-green-500 bg-green-50'
                      )}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h4 className="font-bold text-ink">{ticket.title}</h4>
                    <p className="text-xs text-ink/40">{ticket.location} • {ticket.category}</p>
                  </div>
                  <ChevronRight size={20} className="text-ink/10 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-card/50 rounded-[2.5rem] border border-dashed border-border text-center">
              <p className="text-ink/40 serif-italic">No active tasks assigned to you.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-ink rounded-[2.5rem] p-10 text-white shadow-2xl shadow-ink/20">
            <h3 className="text-xl font-bold mb-6 tracking-tight">System Status</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40 font-bold uppercase tracking-widest">API Connection</span>
                <span className="flex items-center gap-2 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Last Sync</span>
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Just now</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-[2.5rem] border border-border p-10 card-shadow">
            <h3 className="text-xl font-bold mb-8 tracking-tight">Performance Metrics</h3>
            <div className="space-y-8">
              <MetricItem label="Avg. Resolution Time" value="4.2 hrs" />
              <MetricItem label="SLA Compliance" value="98.5%" />
              <MetricItem label="User Satisfaction" value="4.9/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function MetricItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-black text-ink">{value}</span>
      </div>
      <div className="h-1.5 bg-paper rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full w-[85%]" />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend, color }: { label: string, value: string, icon: React.ReactNode, trend: string, color: string }) {
  const colors = {
    blue: "bg-blue-500/5 text-blue-500 border-blue-500/10",
    orange: "bg-orange-500/5 text-orange-500 border-orange-500/10",
    green: "bg-green-500/5 text-green-500 border-green-500/10",
  };
  
  return (
    <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group">
      <div className="flex items-center justify-between mb-8">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", colors[color as keyof typeof colors])}>
          {icon}
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-ink/20">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black tracking-tighter text-ink">{value}</span>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
        <p className="text-[9px] font-bold text-ink/30 uppercase tracking-[0.15em]">{trend}</p>
      </div>
    </div>
  );
}
