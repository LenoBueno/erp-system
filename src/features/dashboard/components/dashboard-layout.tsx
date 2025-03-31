'use client';

import { useDashboard } from '@/features/dashboard/hooks/use-dashboard';
import { DashboardWidget } from './dashboard-widget';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { widgets, addWidget, editWidget, removeWidget } = useDashboard();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => addWidget()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Widget
          </Button>
          <Button
            variant="ghost"
            onClick={() => editWidget()}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {widgets.map((widget) => (
          <DashboardWidget
            key={widget.id}
            widget={widget}
            onRemove={() => removeWidget(widget.id)}
          />
        ))}
      </div>

      {children}
    </div>
  );
}
