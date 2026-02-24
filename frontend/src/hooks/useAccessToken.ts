'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseAccessTokenReturn {
  accessToken: string | null;
  isLoading: boolean;
  error: Error | null;
  refreshToken: () => Promise<void>;
}

export function useAccessToken(): UseAccessTokenReturn {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/token');

      if (response.status === 401) {
        setAccessToken(null);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch access token');
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return { accessToken, isLoading, error, refreshToken: fetchToken };
}
