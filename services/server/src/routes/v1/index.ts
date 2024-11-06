import { postRouter } from './post/index.js';
import { router } from './trpc/index.js';
import { userRouter } from './user/index.js';

export const appRouter = router({
  post: postRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
