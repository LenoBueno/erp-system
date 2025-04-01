import { useState } from 'react';
import { NotificationProps } from '../components/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString()
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 5)); // Limitar a 5 notificações
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  };
}
