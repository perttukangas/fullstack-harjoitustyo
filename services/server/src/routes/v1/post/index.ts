import { TRPCError } from '@trpc/server';

import { StatusCode } from '@sc/utils/status-code.js';

import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@apiv1/trpc/index.js';

import { commentRouter } from './comment/index.js';
import {
  create,
  edit,
  getInfinite,
  getInfiniteCreator,
  hasLiked,
  isCreator,
  like,
  remove,
  removeMany,
  unlike,
} from './database.js';
import {
  createInput,
  editInput,
  infiniteInput,
  likeUnlikeInput,
  removeInput,
  removeManyInput,
} from './shared-validators.js';

export const postRouter = router({
  comment: commentRouter,
  infinite: publicProcedure.input(infiniteInput).query(async (opts) => {
    const { limit, cursor } = opts.input;
    const userId = opts.ctx.userId;

    const posts = await getInfinite({ cursor, limit, userId });

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
  infiniteCreator: protectedProcedure
    .input(infiniteInput)
    .query(async (opts) => {
      const { limit, cursor } = opts.input;
      const userId = opts.ctx.userId;

      const posts = await getInfiniteCreator({ cursor, limit, userId });

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
  like: protectedProcedure.input(likeUnlikeInput).mutation(async (opts) => {
    const { id } = opts.input;
    const userId = opts.ctx.userId;

    const liked = await hasLiked({ id, userId });
    if (liked) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'You have already liked this post',
      });
    }

    await like({ id, userId });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
  unlike: protectedProcedure.input(likeUnlikeInput).mutation(async (opts) => {
    const { id } = opts.input;
    const userId = opts.ctx.userId;

    const liked = await hasLiked({ id, userId });
    if (!liked) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'You have not liked this post',
      });
    }

    await unlike({ id, userId });
    opts.ctx.res.status(StatusCode.OK);
  }),
  create: protectedProcedure.input(createInput).mutation(async (opts) => {
    const { title, content } = opts.input;
    const userId = opts.ctx.userId;
    await create({ title, content, userId });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
  remove: protectedProcedure.input(removeInput).mutation(async (opts) => {
    const { id } = opts.input;
    const userId = opts.ctx.userId;

    const creator = await isCreator({ id, userId });
    if (!creator) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not the creator of this post',
      });
    }

    await remove({ id });
    opts.ctx.res.status(StatusCode.OK);
  }),
  removeMany: protectedProcedure
    .input(removeManyInput)
    .mutation(async (opts) => {
      const { ids } = opts.input;
      const userId = opts.ctx.userId;

      const removed = await removeMany({ ids, userId });

      if (removed.count !== ids.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Successfully removed ${removed.count}/${ids.length} of posts`,
        });
      }

      opts.ctx.res.status(StatusCode.OK);
    }),
  edit: protectedProcedure.input(editInput).mutation(async (opts) => {
    const { id, title, content } = opts.input;
    const userId = opts.ctx.userId;

    const creator = await isCreator({ id, userId });
    if (!creator) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not the creator of this post',
      });
    }

    await edit({ title, content, id });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
});
