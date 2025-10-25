import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const DAILY_CACHE_OPTIONS = {
  staleTime: ONE_DAY_IN_MS, // Data will be considered fresh for 1 day
  cacheTime: ONE_DAY_IN_MS, // Data will be cached for 1 day
};

export const HOURLY_CACHE_OPTIONS = {
  staleTime: ONE_DAY_IN_MS / 24,
  cacheTime: ONE_DAY_IN_MS / 24,
};

export const TWO_HOUR_CACHE_OPTIONS = {
  staleTime: ONE_DAY_IN_MS / 12,
  cacheTime: ONE_DAY_IN_MS / 12,
};

export const HALF_DAY_CACHE_OPTIONS = {
  staleTime: ONE_DAY_IN_MS / 2,
  cacheTime: ONE_DAY_IN_MS / 2,
};