import { useState, useEffect } from 'react';
import { notificationAPI } from '../api';
import { useAuth } from '../store/AuthContext';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    notificationAPI.getAll()
      .then(res => {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.filter(n => !n.isRead).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const markAllRead = async () => {
    await notificationAPI.readAll();
    setNotifications(n => n.map(notif => ({ ...notif, isRead: true })));
    setUnreadCount(0);
  };

  const addNotification = (notif) => {
    setNotifications(prev => [notif, ...prev]);
    setUnreadCount(c => c + 1);
  };

  return { notifications, unreadCount, loading, markAllRead, addNotification };
}
