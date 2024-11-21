import { QueryClient } from '@tanstack/react-query';
import { TRPCClientError, httpBatchLink } from '@trpc/client';
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query';
import type { inferRouterOutputs } from '@trpc/server';

// Requires npm run build to be ran first in server folder
import type { AppRouter } from '@tapiv1/index';

import { toast } from '@cc/hooks/use-toast';

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
      url: `/api/v1`,
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
