import { useState, useEffect } from 'react';

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('growtix_notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotifications(parsed);
      setUnreadCount(parsed.filter((n: any) => !n.read).length);
    }
  }, []);

  const addNotification = (title: string, type: 'news' | 'hackathon' | 'event') => {
    const newNotif = {
      id: Date.now(),
      title,
      type,
      read: false,
      time: new Date().toISOString()
    };
    const updated = [newNotif, ...notifications].slice(0, 10); // Keep last 10
    setNotifications(updated);
    setUnreadCount(prev => prev + 1);
    localStorage.setItem('growtix_notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
  setNotifications([]);
  setUnreadCount(0);
  localStorage.setItem('growtix_notifications', JSON.stringify([]));
};

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem('growtix_notifications', JSON.stringify(updated));
  };

  return { unreadCount, notifications, addNotification, markAllAsRead, clearAll };
}