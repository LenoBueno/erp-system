import { useState, useEffect } from 'react';

interface UseOptimizedComponentProps {
  component: React.ComponentType<any>;
  threshold?: number;
  rootMargin?: string;
}

export function useOptimizedComponent({
  component: Component,
  threshold = 0,
  rootMargin = '0px'
}: UseOptimizedComponentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    const element = document.querySelector('.optimized-component');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return {
    isVisible,
    Component
  };
}
