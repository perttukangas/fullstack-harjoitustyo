import { router } from '@s/core/lib/trpc/index.js';

import { postRouter } from './post/index.js';

export const appRouter = router({
  post: postRouter,
});

export type AppRouter = typeof appRouter;
