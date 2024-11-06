import { createExpressMiddleware } from '@trpc/server/adapters/express';

import { appRouter } from '../index.js';
import { createContext } from './auth-context.js';

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: createContext,
});
