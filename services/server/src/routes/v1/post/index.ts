import { z } from 'zod';

import { getPage } from '@s/core/lib/prisma/post.js';
import { publicProcedure, router } from '@s/core/lib/trpc/index.js';

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
