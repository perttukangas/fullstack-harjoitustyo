import { router } from '.';
import { postRouter } from './post';

export const appRouter = router({
  post: postRouter,
});

export type AppRouter = typeof appRouter;
