import { StatusCode } from '@s/core/utils/status-code.js';

import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@apiv1/trpc/index.js';

import { commentRouter } from './comment/index.js';
import { create, edit, getInfinite, like, remove } from './database.js';
import {
  createInput,
  editInput,
  infiniteInput,
  likeInput,
  removeInput,
} from './validators.js';

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
    const { id } = opts.input;
    const userId = opts.ctx.userId;
    await like({ id, userId });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
  create: protectedProcedure.input(createInput).mutation(async (opts) => {
    const { title, content } = opts.input;
    const userId = opts.ctx.userId;
    await create({ title, content, userId });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
  remove: protectedProcedure.input(removeInput).mutation(async (opts) => {
    const { id } = opts.input;
    await remove({ id });
    opts.ctx.res.status(StatusCode.OK);
  }),
  edit: protectedProcedure.input(editInput).mutation(async (opts) => {
    const { id, title, content } = opts.input;
    await edit({ title, content, id });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
});
