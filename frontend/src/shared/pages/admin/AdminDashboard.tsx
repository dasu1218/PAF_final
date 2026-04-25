import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Calendar, 
  Ticket, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../../lib/utils';
import { bookingService, Booking } from '../../../features/booking/bookingService';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const bookingData = await bookingService.getBookings();
      setBookings(bookingData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Resources', value: '42', icon: <Package size={20} />, trend: '+4 this month', color: 'blue' },
    { label: 'Total Bookings', value: bookings.length.toString(), icon: <Calendar size={20} />, trend: `+${bookings.filter(b => b.status === 'APPROVED').length} approved`, color: 'orange' },
    { label: 'Pending Bookings', value: bookings.filter(b => b.status === 'PENDING').length.toString(), icon: <Clock size={20} />, trend: 'Requires attention', color: 'purple' },
    { label: 'Active Tickets', value: '14', icon: <Ticket size={20} />, trend: '+3 new today', color: 'green' },
  ];

  const recentActivities = bookings.slice(0, 4).map(b => ({
    id: b.id,
    type: 'BOOKING',
    title: b.status === 'PENDING' ? 'New Booking Request' : `Booking ${b.status}`,
    detail: `${b.userName} requested ${b.resourceName}`,
    time: 'Recently',
    status: b.status
  }));

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-ink">Admin Command Center</h1>
          <p className="text-xl serif-italic text-ink/50">System-wide monitoring and resource management.</p>
        </div>
        <div className="flex items-center gap-4 bg-card px-6 py-4 rounded-3xl border border-border shadow-xl shadow-black/5">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-ink/60">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <StatCard 
            key={i} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            trend={stat.trend} 
            color={stat.color} 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-[3rem] border border-border p-10 card-shadow">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-bold tracking-tight">Recent Activity</h3>
            <button className="text-[11px] font-bold uppercase tracking-widest text-accent hover:text-ink transition-colors">View All Logs</button>
          </div>
          
          <div className="space-y-8">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-6 group cursor-pointer">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110",
                  activity.type === 'BOOKING' ? "bg-blue-500/5 text-blue-500" : 
                  activity.type === 'TICKET' ? "bg-orange-500/5 text-orange-500" : "bg-purple-500/5 text-purple-500"
                )}>
                  {activity.type === 'BOOKING' ? <Calendar size={24} /> : 
                   activity.type === 'TICKET' ? <Ticket size={24} /> : <Package size={24} />}
                </div>
                <div className="flex-1 border-b border-border pb-8 group-last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-lg group-hover:text-accent transition-colors">{activity.title}</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/20">{activity.time}</span>
                  </div>
                  <p className="text-ink/40 text-sm mb-3">{activity.detail}</p>
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border",
                    activity.status === 'PENDING' ? "bg-orange-500/5 text-orange-500 border-orange-500/10" :
                    activity.status === 'APPROVED' ? "bg-green-500/5 text-green-500 border-green-500/10" : "bg-gray-500/5 text-gray-500 border-gray-500/10"
                  )}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <div className="bg-ink text-white rounded-[3rem] p-10 card-shadow relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-all duration-700" />
            <h3 className="text-xl font-bold mb-3 relative z-10">Quick Management</h3>
            <p className="text-white/50 text-sm mb-8 leading-relaxed relative z-10">Access administrative tools and system configurations.</p>
            <div className="space-y-4 relative z-10">
              <button className="w-full py-4 bg-paper text-ink font-bold rounded-2xl hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-3">
                Add Resource <ArrowUpRight size={18} />
              </button>
              <button className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3">
                System Settings <Settings size={18} />
              </button>
            </div>
          </div>

          <div className="bg-card rounded-[2.5rem] border border-border p-10 card-shadow">
            <h3 className="text-xl font-bold mb-8 tracking-tight">System Health</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink/60">API Latency</span>
                <span className="text-sm font-bold text-green-500">24ms</span>
              </div>
              <div className="w-full bg-ink/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[95%]" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink/60">Server Load</span>
                <span className="text-sm font-bold text-orange-500">42%</span>
              </div>
              <div className="w-full bg-ink/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[42%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({ label, value, icon, trend, color }: { label: string, value: string, icon: React.ReactNode, trend: string, color: string, key?: React.Key }) {
  const colors = {
    blue: "bg-blue-500/5 text-blue-500 border-blue-500/10",
    orange: "bg-orange-500/5 text-orange-500 border-orange-500/10",
    green: "bg-green-500/5 text-green-500 border-green-500/10",
    purple: "bg-purple-500/5 text-purple-500 border-purple-500/10",
  };
  
  return (
    <div className="bg-card p-10 rounded-[2.5rem] border border-border card-shadow group hover:-translate-y-1 transition-all duration-500">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110", colors[color as keyof typeof colors])}>
        {icon}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-4xl font-bold tracking-tight">{value}</h4>
        <span className="text-[10px] font-bold text-green-500 mb-1">{trend}</span>
      </div>
    </div>
  );
}
