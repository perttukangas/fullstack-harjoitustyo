import { z } from 'zod';

import { publicProcedure, router } from '../';
import { getPage } from '../../../core/lib/prisma/post';

export const postRouter = router({
  infinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(5).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;

      const limit = input.limit ?? 20;
      const cursor = input.cursor;

      const posts = await getPage(cursor, limit);

      let nextCursor = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),
});
