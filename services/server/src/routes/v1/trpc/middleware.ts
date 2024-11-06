import { createExpressMiddleware } from '@trpc/server/adapters/express';

import { appRouter } from '../index.js';
import { createContext } from './auth.js';

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      console.error('Error:', error);
    }
  },
});
