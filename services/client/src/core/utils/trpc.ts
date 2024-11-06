import { TRPCClientError } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '../../../../server/src/routes/v1/index';

export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const isTRPCClientError = (
  cause: unknown
): cause is TRPCClientError<AppRouter> => {
  return cause instanceof TRPCClientError;
};

export const t = createTRPCReact<AppRouter>();
export const Provider = t.Provider;

export const getToken = () => {
  return window.localStorage.getItem('token');
};

export const setToken = (token: string) => {
  // Yes this should be in cookie
  window.localStorage.setItem('token', token);
};
