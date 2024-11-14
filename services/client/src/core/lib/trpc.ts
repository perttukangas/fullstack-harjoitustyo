import { QueryClient } from '@tanstack/react-query';
import { TRPCClientError, httpBatchLink } from '@trpc/client';
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query';
import type { inferRouterOutputs } from '@trpc/server';

import { toast } from '@c/core/hooks/use-toast';

import type { AppRouter } from '../../../../server/src/routes/v1/index';

const serverUrl = import.meta.env.VITE_SERVER_URL as string;
if (!serverUrl) {
  throw new Error('VITE_SERVER_URL is not defined');
}

export let csrfToken: string;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const isTRPCClientError = (
  cause: unknown
): cause is TRPCClientError<AppRouter> => {
  return cause instanceof TRPCClientError;
};

export const t = createTRPCReact<AppRouter>();
export const Provider = t.Provider;

export const trpcClient = t.createClient({
  links: [
    httpBatchLink({
      url: `${serverUrl}/api/v1`,
      headers() {
        return {
          'x-csrf-token': csrfToken,
        };
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        if (isTRPCClientError(error)) {
          toast({ variant: 'destructive', description: `${error.message}` });
        } else {
          toast({
            variant: 'destructive',
            description: `Internal server error!`,
          });

          if (import.meta.env.DEV) {
            console.error(
              'Printing non-trpc error in development mode.',
              error
            );
          }
        }
      },
    },
  },
});

export const clientUtils = createTRPCQueryUtils({
  queryClient,
  client: trpcClient,
});