import React, { useState } from 'react';
import { 
  Megaphone, 
  Send, 
  Type, 
  User, 
  Bell,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  History,
  Trash2,
  Search
} from 'lucide-react';
import { notificationService, NotificationType, Notification } from '../../../features/notification/notificationService';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';
import { ConfirmModal } from '../../components/ConfirmModal';

export const AdminNoticePage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('INFO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentNotices, setRecentNotices] = useState<Notification[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await notificationService.getNotifications();
      // Filter for global notices (userId is null or empty)
      const globalNotices = data.filter(n => !n.userId).slice(0, 5);
      setRecentNotices(globalNotices);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    try {
      await notificationService.createNotification({
        message,
        type,
      });
      toast.success('Notice published successfully');
      setMessage('');
      fetchHistory();
    } catch (error) {
      toast.error('Failed to publish notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setNoticeToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (noticeToDelete) {
      try {
        await notificationService.deleteNotification(noticeToDelete);
        toast.success('Notice deleted');
        fetchHistory();
      } catch (error) {
        toast.error('Failed to delete notice');
      } finally {
        setNoticeToDelete(null);
      }
    }
  };

  const typeOptions: { value: NotificationType; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'INFO', label: 'Information', icon: <Info size={16} />, color: 'text-blue-500' },
    { value: 'SUCCESS', label: 'Success', icon: <CheckCircle2 size={16} />, color: 'text-green-500' },
    { value: 'WARNING', label: 'Warning', icon: <AlertTriangle size={16} />, color: 'text-amber-500' },
    { value: 'ERROR', label: 'Urgent/Error', icon: <AlertCircle size={16} />, color: 'text-red-500' },
  ];

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-accent mb-2">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Megaphone size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Communication Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-ink uppercase">
            Publish <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink to-ink/40">Notices</span>
          </h1>
          <p className="text-ink/40 font-medium max-w-xl">
            Broadcast important updates, maintenance schedules, or system-wide announcements to all students and staff instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Compose Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700">
              <Send size={120} />
            </div>
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 gap-8">
                {/* Type Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Notice Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {typeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setType(opt.value)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 text-[12px] font-bold",
                          type === opt.value 
                            ? "bg-ink text-white border-ink shadow-lg shadow-ink/10" 
                            : "bg-black/[0.02] border-transparent text-ink/40 hover:bg-black/[0.05]"
                        )}
                      >
                        <span className={cn(type === opt.value ? "text-white" : opt.color)}>
                          {opt.icon}
                        </span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Message Content</label>
                <div className="relative group/input">
                  <Type className="absolute left-5 top-6 text-ink/20 group-focus-within/input:text-accent transition-colors" size={16} />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your announcement here..."
                    rows={6}
                    className="w-full pl-12 pr-6 py-5 bg-black/[0.02] border border-transparent rounded-3xl text-[14px] font-medium focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-accent/5 outline-none transition-all duration-300 resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <p className="text-[11px] text-ink/30 font-medium italic">
                  * System-wide notices will be visible in every user's notification feed.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-3 px-10 py-4 bg-ink text-white rounded-2xl font-bold text-[13px] uppercase tracking-[0.15em] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-2xl shadow-ink/20"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Publish Now</span>
                      <Send size={16} className="mb-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Recent History Sidebar */}
        <div className="space-y-8">
          <div className="bg-white/50 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History size={18} className="text-ink/40" />
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em]">Live Feed</h3>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50" />
            </div>

            <div className="space-y-4">
              {isLoadingHistory ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-black/[0.02] rounded-2xl animate-pulse" />
                ))
              ) : recentNotices.length > 0 ? (
                recentNotices.map((notice) => (
                  <div 
                    key={notice.id} 
                    className="group/item relative bg-white border border-border p-5 rounded-2xl hover:shadow-xl hover:shadow-black/5 transition-all duration-500"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className={cn(
                        "p-2 rounded-xl",
                        notice.type === 'INFO' ? 'bg-blue-50 text-blue-500' :
                        notice.type === 'SUCCESS' ? 'bg-green-50 text-green-500' :
                        notice.type === 'WARNING' ? 'bg-amber-50 text-amber-500' :
                        'bg-red-50 text-red-500'
                      )}>
                        {notice.type === 'INFO' && <Info size={14} />}
                        {notice.type === 'SUCCESS' && <CheckCircle2 size={14} />}
                        {notice.type === 'WARNING' && <AlertTriangle size={14} />}
                        {notice.type === 'ERROR' && <AlertCircle size={14} />}
                      </div>
                      <button 
                        onClick={() => handleDeleteClick(notice.id)}
                        className="opacity-0 group-hover/item:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[12px] font-medium text-ink/80 line-clamp-2 leading-relaxed mb-3">
                      {notice.message}
                    </p>
                    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-ink/20">
                      <span>{notice.userId ? 'Direct' : 'Global'}</span>
                      <span>{format(new Date(notice.timestamp), 'MMM dd, HH:mm')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 bg-black/[0.02] rounded-full flex items-center justify-center mx-auto text-ink/10">
                    <Bell size={24} />
                  </div>
                  <p className="text-[11px] font-bold text-ink/20 uppercase tracking-widest">No recent notices</p>
                </div>
              )}
            </div>

            <button 
              onClick={fetchHistory}
              className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-ink/30 hover:text-accent border border-transparent hover:border-accent/10 hover:bg-accent/5 rounded-2xl transition-all duration-500"
            >
              Refresh Feed
            </button>
          </div>

          <div className="bg-ink rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Megaphone size={120} />
            </div>
            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] mb-4 relative z-10">Pro Tip</h4>
            <p className="text-white/60 text-[11px] leading-relaxed relative z-10">
              Use "Urgent" type for critical maintenance windows or immediate safety alerts. These will appear highlighted in the user's notification list.
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Global Notice?"
        message="Are you sure you want to delete this announcement? It will be removed from all users' notification feeds permanently."
      />
    </div>
  );
};
