import { QueryClient } from '@tanstack/react-query';
import { TRPCClientError, httpBatchLink } from '@trpc/client';
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query';
import type { inferRouterOutputs } from '@trpc/server';

import { toast } from '@cc/hooks/use-toast';
import { StorageType, getItem } from '@cc/utils/session-storage';

// Requires npm run build to be ran first in server folder
// More foolproof way to ensure server side code isn't bundled to client
import type { AppRouter } from '@tapiv1/index';

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
      url: `/api/v1`,
      headers() {
        return {
          'x-csrf-token': getItem(StorageType.CSRF),
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
