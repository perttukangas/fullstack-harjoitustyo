import { StatusCode } from '@s/core/utils/status-code.js';

import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@apiv1/trpc/index.js';

import { create, getInfinite, like } from './database.js';
import { createInput, infiniteInput, likeInput } from './validators.js';

export const commentRouter = router({
  infinite: publicProcedure.input(infiniteInput).query(async (opts) => {
    const { limit, cursor, postId } = opts.input;

    const comments = await getInfinite({ postId, limit, cursor });

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
  like: protectedProcedure.input(likeInput).mutation(async (opts) => {
    const { commentId } = opts.input;
    const userId = opts.ctx.userId;
    await like({ commentId, userId });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
  create: protectedProcedure.input(createInput).mutation(async (opts) => {
    const { content, postId } = opts.input;
    const userId = opts.ctx.userId;
    await create({ content, userId, postId });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
});
