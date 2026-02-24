'use client';

import { useEffect } from 'react';
import { useAccessToken } from './useAccessToken';
import { api } from '@/lib/api';

interface UseAuthenticatedApiReturn {
  api: typeof api;
  isAuthLoading: boolean;
  accessToken: string | null;
}

export function useAuthenticatedApi(): UseAuthenticatedApiReturn {
  const { accessToken, isLoading } = useAccessToken();

  useEffect(() => {
    api.setAccessToken(accessToken);
  }, [accessToken]);

  return { api, isAuthLoading: isLoading, accessToken };
}
