import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Info, MessageSquare, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'BOOKING' | 'TICKET' | 'COMMENT';
  referenceId: string;
  read: boolean;
  createdAt: string;
}

export const NotificationPanel: React.FC<{ userId: string }> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [userId]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:8080/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`http://localhost:8080/api/notifications/user/${userId}/read-all`, { method: 'PUT' });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOKING': return <Info className="h-4 w-4 text-blue-500" />;
      case 'TICKET': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'COMMENT': return <MessageSquare className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/80 text-secondary shadow-sm shadow-black/5 backdrop-blur-md transition hover:-translate-y-0.5 hover:text-primary"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-3 w-80 max-h-[480px] overflow-hidden rounded-2xl border border-border bg-surface/95 shadow-2xl backdrop-blur-xl z-40 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border/50 p-4">
              <h3 className="text-sm font-semibold text-primary">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-[#F27D26] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-8 w-8 text-border mb-3" />
                  <p className="text-sm text-secondary">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`group relative flex gap-3 border-b border-border/40 p-4 transition hover:bg-input/50 cursor-pointer ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface shadow-sm ring-1 ring-border/50">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed ${!notification.read ? 'font-medium text-primary' : 'text-secondary'}`}>
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[10px] text-secondary/60">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#F27D26]" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
