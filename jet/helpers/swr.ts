import http from '../../http';
import useSwr from 'swr';
import { Token } from '../../types';

export async function swrHttpFetcher(url: string) {
  const { ok, data, errors } = await http(url);
  if (!ok) {
    throw new Error(errors);
  }
  return data;
}

export function useTwoFactorRecoveryCodes() {
  return useSwr<string[]>(
    'user/two-factor-recovery-codes',
    async url => swrHttpFetcher(url),
    { shouldRetryOnError: false },
  );
}

export function useTwoFactorStatus() {
  return useSwr<{ enabled: boolean }>('user/two-factor-status', async url =>
    swrHttpFetcher(url),
  );
}

export function useApiTokens() {
  return useSwr<{
    tokens: Token[];
    availablePermissions: string[];
    defaultPermissions: string[];
  }>('user/api-tokens', swrHttpFetcher);
}
