'use client';

import { useState, useCallback, useRef } from 'react';
import { getErrorMessage } from '@/lib/error-messages';

interface ApiCallOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
  resetDelay?: number;
  minLoadingMs?: number;
}

interface ApiState<T, A extends unknown[]> {
  data: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  execute: (...args: A) => Promise<T | null>;
  reset: () => void;
}

const MIN_LOADING_TIME = 300;

export function useApiCall<T, A extends unknown[] = []>(
  fn: (...args: A) => Promise<T>,
  options?: ApiCallOptions<T>
): ApiState<T, A> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
  }, []);

  const execute = useCallback(
    async (...args: A): Promise<T | null> => {
      // Clear previous state
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);

      const startTime = Date.now();
      const minDelay = options?.minLoadingMs ?? MIN_LOADING_TIME;

      try {
        const result = await fn(...args);

        // Enforce minimum loading time to prevent flash
        const elapsed = Date.now() - startTime;
        if (elapsed < minDelay) {
          await new Promise((r) => setTimeout(r, minDelay - elapsed));
        }

        setData(result);
        setIsLoading(false);
        setIsSuccess(true);

        options?.onSuccess?.(result);

        // Auto-reset success state
        const resetDelay = options?.resetDelay ?? 2000;
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => {
          setIsSuccess(false);
        }, resetDelay);

        return result;
      } catch (err) {
        // Enforce minimum loading time
        const elapsed = Date.now() - startTime;
        if (elapsed < minDelay) {
          await new Promise((r) => setTimeout(r, minDelay - elapsed));
        }

        const errorMsg = options?.errorMessage || getErrorMessage(err);
        setError(errorMsg);
        setIsLoading(false);
        setIsError(true);

        options?.onError?.(errorMsg);

        return null;
      }
    },
    [fn, options]
  );

  return { data, isLoading, isSuccess, isError, error, execute, reset };
}
