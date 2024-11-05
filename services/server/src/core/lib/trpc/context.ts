import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { getAuth } from '../auth/index.js';

export const createContext = async (opts: CreateExpressContextOptions) => {
  const session = await getAuth(opts.req);

  return {
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
