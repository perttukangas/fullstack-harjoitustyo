import { createExpressMiddleware } from '@trpc/server/adapters/express';

import { appRouter } from '../../../routes/v1/index.js';
import { createContext } from './context.js';

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: createContext,
});
