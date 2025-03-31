'use client';

import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseAsyncStateResult<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useAsyncState<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    showToast?: boolean;
  }
): UseAsyncStateResult<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const { toast } = useToast();

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const result = await asyncFn(...args);
        setState({
          data: result,
          isLoading: false,
          error: null,
        });
        options?.onSuccess?.(result);
        if (options?.showToast) {
          toast({
            title: 'Sucesso',
            description: 'Operação realizada com sucesso',
            variant: 'default',
          });
        }
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error('Erro desconhecido');
        setState({
          data: null,
          isLoading: false,
          error: errorObj,
        });
        options?.onError?.(errorObj);
        if (options?.showToast) {
          toast({
            title: 'Erro',
            description: errorObj.message,
            variant: 'destructive',
          });
        }
      }
    },
    [asyncFn, options, toast]
  );

  return {
    ...state,
    execute,
    reset,
  };
}