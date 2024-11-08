import { createExpressMiddleware } from '@trpc/server/adapters/express';

import { error as lerror } from '@s/core/utils/logger.js';

import { appRouter } from '../index.js';
import { createContext } from './auth.js';

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      lerror('Internal server error:', error);
    }

    // Incase of internal server error, we don't want to leak the error to the client
    error.message = 'Internal server error';
  },
});
