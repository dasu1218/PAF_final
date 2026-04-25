import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  MoreHorizontal, 
  Calendar, 
  Ticket, 
  Settings,
  Check,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { notificationService, Notification, NotificationType } from './notificationService';
import { useAuth } from '../../shared/context/AuthContext';
import { ConfirmModal } from '../../shared/components/ConfirmModal';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      setIsLoading(true);
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
      setIsLoading(false);
    };
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteClick = (id: string) => {
    setNotificationToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (notificationToDelete) {
      await notificationService.deleteNotification(notificationToDelete);
      setNotifications(prev => prev.filter(n => n.id !== notificationToDelete));
      setNotificationToDelete(null);
    }
  };

  const filteredNotifications = notifications;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 size={18} />;
      case 'WARNING': return <Clock size={18} />;
      case 'ERROR': return <AlertCircle size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-orange-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-ink">Notifications</h1>
          <p className="text-xl serif-italic text-ink/50">Stay updated with your bookings, tickets, and campus alerts.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleMarkAllAsRead}
            className="px-6 py-3 bg-white border border-black/5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40 hover:text-accent hover:border-accent transition-all duration-300"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-black/5" />

      {/* Notifications List */}
      <div className="bg-card rounded-[3rem] border border-black/5 overflow-hidden card-shadow">
        {isLoading ? (
          <div className="p-20 space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-paper animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="divide-y divide-black/5">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "p-8 flex items-start gap-8 transition-all duration-500 group relative",
                  notification.isRead ? "bg-card border-border opacity-50" : "bg-card border-accent/20 shadow-xl shadow-accent/5 ring-1 ring-accent/10"
                )}
              >
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                )}
                
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 shadow-lg shadow-black/5",
                  notification.type === 'SUCCESS' ? "bg-green-50 text-green-600" : 
                  notification.type === 'WARNING' ? "bg-orange-50 text-orange-600" : 
                  notification.type === 'ERROR' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                )}>
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold tracking-tight text-ink">
                        {notification.type} Notification
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/20">
                      {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-4 text-ink/60">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink/20">
                      <Clock size={12} /> {new Date(notification.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDeleteClick(notification.id)}
                    className="p-3 hover:bg-red-50 text-ink/20 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-32 text-center">
            <div className="w-24 h-24 bg-paper rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-black/5">
              <Bell className="text-ink/10" size={48} />
            </div>
            <h3 className="text-3xl font-bold text-ink mb-3">All caught up!</h3>
            <p className="text-xl serif-italic text-ink/30">No new notifications to show right now.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Notification?"
        message="Are you sure you want to permanently remove this notification from your inbox? This action cannot be undone."
      />
    </div>
  );
};
