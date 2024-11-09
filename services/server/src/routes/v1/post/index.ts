import { StatusCode } from '@s/core/utils/status-code.js';

import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@apiv1/trpc/index.js';

import { commentRouter } from './comment/index.js';
import { create, getInfinite, like } from './database.js';
import { createInput, infiniteInput, likeInput } from './validators.js';

export const postRouter = router({
  comment: commentRouter,
  infinite: publicProcedure.input(infiniteInput).query(async (opts) => {
    const { limit, cursor } = opts.input;

    const posts = await getInfinite({ cursor, limit });

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
  like: protectedProcedure.input(likeInput).mutation(async (opts) => {
    const { postId } = opts.input;
    const userId = opts.ctx.userId;
    await like({ postId, userId });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
  create: protectedProcedure.input(createInput).mutation(async (opts) => {
    const { title, content } = opts.input;
    const userId = opts.ctx.userId;
    await create({ title, content, userId });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
});
