import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Ticket, 
  Bell, 
  ArrowUpRight,
  User,
  Activity,
  Calendar,
  Zap,
  Shield
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../../lib/utils';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-paper pb-24 px-6 md:px-16 pt-12 md:pt-20 max-w-7xl mx-auto w-full space-y-20">
      
      {/* Refined Minimal Header */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 text-accent/60 font-black uppercase tracking-[0.4em] text-[10px]">
          <div className="w-8 h-px bg-accent/30" />
          <span>Nodes Active / Operational</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-ink tracking-tighter leading-[0.85]">
          Good day, <br />
          <span className="serif-italic lowercase font-medium text-accent">{user?.name?.split(' ')[0] || 'User'}</span>.
        </h1>
        <p className="text-ink/40 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
          The campus orchestration engine is running at peak capacity. All systems are synchronized.
        </p>
      </motion.header>

      {/* Minimal Stat Chips */}
      <div className="flex flex-wrap gap-4">
        <StatChip label="Active Bookings" value="03" icon={<Calendar size={14} />} />
        <StatChip label="Open Tickets" value="01" icon={<Zap size={14} />} />
        <StatChip label="Alerts" value="00" icon={<Bell size={14} />} />
        <StatChip label="Security" value="Encrypted" icon={<Shield size={14} />} color="text-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Quick Access Engine */}
        <section className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard 
            title="Reserve Space"
            desc="Book labs, auditoriums, and creative hubs."
            icon={<Plus size={24} />}
            path="/bookings"
            color="bg-accent text-white"
          />
          <ActionCard 
            title="Infrastructure Support"
            desc="Report issues and track resolution status."
            icon={<Ticket size={24} />}
            path="/tickets"
            color="bg-card border-border border"
          />
          <ActionCard 
            title="Notification Center"
            desc="View your latest updates and alerts."
            icon={<Bell size={24} />}
            path="/notifications"
            color="bg-card border-border border"
          />
        </section>

        {/* Simplified History/Feed */}
        <section className="lg:col-span-8 space-y-10">
          <div className="flex items-end justify-between border-b border-border pb-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">Recent Activity</h2>
            <button className="text-[11px] font-black uppercase tracking-widest text-accent hover:underline">Full Audit Log</button>
          </div>
          
          <div className="space-y-8">
            <ActivityItem 
              title="System Authentication" 
              desc="Successful login from node 192.168.1.1" 
              time="JUST NOW"
            />
            <ActivityItem 
              title="Identity Verification" 
              desc="New security phrase established for node access." 
              time="2H AGO"
            />
            <ActivityItem 
              title="Resource Confirmation" 
              desc="Innovation Lab reservation has been successfully validated." 
              time="5H AGO"
            />
          </div>
        </section>

        {/* Minimal Identity Card */}
        <section className="lg:col-span-4 self-start">
          <div className="bg-card border border-border rounded-[2.5rem] p-10 space-y-8 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-accent/5">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="" />
              </div>
              <div>
                <p className="font-black text-ink uppercase tracking-tight">{user?.name}</p>
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-between text-[11px] font-bold text-ink/30 uppercase tracking-[0.2em] mb-4">
                <span>System Status</span>
                <span className="text-green-500">Online</span>
              </div>
              <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
                <div className="w-full h-full bg-green-500" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

function StatChip({ label, value, icon, color = "text-accent" }: { label: string, value: string, icon: React.ReactNode, color?: string }) {
  return (
    <div className="px-5 py-3 bg-card border border-border rounded-2xl flex items-center gap-4 hover:border-accent/20 transition-all cursor-default">
      <div className={cn("w-8 h-8 rounded-xl bg-surface flex items-center justify-center shrink-0", color)}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-black text-ink leading-tight">{value}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-ink/30">{label}</span>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon, path, color }: { title: string, desc: string, icon: React.ReactNode, path: string, color: string }) {
  const navigate = useNavigate();
  return (
    <motion.button
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className={cn(
        "p-10 rounded-[2.5rem] text-left group transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden relative",
        color
      )}
    >
      <div className="relative z-10">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6",
          color.includes('bg-accent') || color.includes('bg-ink') ? "bg-white/10 text-white" : "bg-surface text-accent"
        )}>
          {icon}
        </div>
        <h3 className="text-xl font-black mb-3 tracking-tight flex items-center gap-2">
          {title} <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
        </h3>
        <p className={cn(
          "text-sm font-medium leading-relaxed",
          color.includes('bg-ink') ? "text-white/40" : "text-ink/40"
        )}>
          {desc}
        </p>
      </div>
      {(color.includes('bg-ink') || color.includes('bg-accent')) && (
        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
      )}
    </motion.button>
  );
}

function ActivityItem({ title, desc, time }: { title: string, desc: string, time: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="relative flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-accent group-hover:scale-125 transition-transform" />
        <div className="w-px h-full bg-border mt-2" />
      </div>
      <div className="flex-1 pb-10 border-b border-border group-last:border-0 group-last:pb-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-sm text-ink group-hover:text-accent transition-colors">
            {title}
          </h4>
          <span className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.2em]">
            {time}
          </span>
        </div>
        <p className="text-[13px] text-ink/40 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}
