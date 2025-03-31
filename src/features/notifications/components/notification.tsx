'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export function Notification({ type, title, message, duration = 5000 }: NotificationProps) {
  const [visible, setVisible] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <div
      className={`fixed right-4 top-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      } ${getBackgroundColor()} rounded-lg p-4 shadow-lg flex items-center gap-4`}
    >
      <Bell className={`h-6 w-6 ${getIconColor()}`} />
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
