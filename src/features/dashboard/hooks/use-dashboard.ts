import { useState, useCallback } from 'react';
import { Widget } from '../types/dashboard.type';
import { v4 as uuidv4 } from 'uuid';

export function useDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const addWidget = useCallback(() => {
    const newWidget: Widget = {
      id: uuidv4(),
      type: 'chart',
      title: 'Novo Widget',
      position: {
        x: 0,
        y: 0,
        w: 4,
        h: 4
      },
      settings: {
        chartType: 'line',
        data: [],
        colors: ['#2563eb', '#10b981', '#f97316']
      }
    };

    setWidgets(prev => [...prev, newWidget]);
  }, []);

  const editWidget = useCallback((id: string, settings: Partial<Widget['settings']>) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, settings: { ...widget.settings, ...settings } } : widget
    ));
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  }, []);

  return {
    widgets,
    addWidget,
    editWidget,
    removeWidget
  };
}
