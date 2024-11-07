import { z } from 'zod';

import { publicProcedure, router } from '@apiv1/trpc/index.js';

import { getInfinite } from './database.js';

export const commentRouter = router({
  infinite: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        limit: z.number().min(5).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;

      const limit = input.limit ?? 20;
      const cursor = input.cursor;
      const postId = input.postId;

      const comments = await getInfinite(postId, cursor, limit);

      let nextCursor = undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop();
        nextCursor = nextItem?.id;
      }

      return {
        comments,
        nextCursor,
      };
    }),
});
