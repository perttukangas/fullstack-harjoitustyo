import { router } from '@s/core/lib/trpc/index.js';

import { postRouter } from './post/index.js';
import { userRouter } from './user/index.js';

export const appRouter = router({
  post: postRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
