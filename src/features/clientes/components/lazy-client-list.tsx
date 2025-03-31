'use client';

import { lazy } from 'react';
import { useOptimizedComponent } from '@/hooks/use-optimized-component';

const ClientList = lazy(() => import('./client-list').then(module => ({ default: module.ClientList })));

export function LazyClientList() {
  const { isVisible, Component } = useOptimizedComponent({
    component: ClientList,
    threshold: 0.1,
    rootMargin: '0px 0px 100px 0px'
  });

  return (
    <div className="optimized-component">
      {isVisible ? (
        <Component />
      ) : (
        <div className="animate-pulse bg-gray-200 rounded-lg p-4">
          Carregando clientes...
        </div>
      )}
    </div>
  );
}
