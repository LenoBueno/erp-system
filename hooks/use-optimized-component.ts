'use client';

import { ComponentType, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface OptimizedComponentProps {
  component: ComponentType;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface OptimizedComponentResult {
  isVisible: boolean;
  Component: ComponentType;
  ref: (node?: Element | null) => void;
}

export function useOptimizedComponent({
  component,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: OptimizedComponentProps): OptimizedComponentResult {
  const [Component, setComponent] = useState<ComponentType>(() => component);
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  });

  useEffect(() => {
    if (inView && Component !== component) {
      setComponent(component);
    }
  }, [inView, component, Component]);

  return {
    isVisible: inView,
    Component,
    ref,
  };
}