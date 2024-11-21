import { TRPCError } from '@trpc/server';

import { StatusCode } from '@sc/utils/status-code.js';

import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@apiv1/trpc/index.js';

import {
  create,
  edit,
  getInfinite,
  hasLiked,
  isCreator,
  like,
  remove,
  unlike,
} from './database.js';
import {
  createInput,
  editInput,
  infiniteInput,
  likeUnlikeInput,
  removeInput,
} from './shared-validators.js';

export const commentRouter = router({
  infinite: publicProcedure.input(infiniteInput).query(async (opts) => {
    const { limit, cursor, postId } = opts.input;
    const userId = opts.ctx.userId;

    const comments = await getInfinite({ postId, limit, cursor, userId });

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
  like: protectedProcedure.input(likeUnlikeInput).mutation(async (opts) => {
    const { id } = opts.input;
    const userId = opts.ctx.userId;

    const liked = await hasLiked({ id, userId });
    if (liked) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'You have already liked this comment',
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
        message: 'You have not liked this comment',
      });
    }

    await unlike({ id, userId });
    opts.ctx.res.status(StatusCode.OK);
  }),
  create: protectedProcedure.input(createInput).mutation(async (opts) => {
    const { content, postId } = opts.input;
    const userId = opts.ctx.userId;
    await create({ content, userId, postId });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
  remove: protectedProcedure.input(removeInput).mutation(async (opts) => {
    const { id } = opts.input;
    const userId = opts.ctx.userId;

    const creator = await isCreator({ id, userId });
    if (!creator) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not the creator of this comment',
      });
    }

    await remove({ id });
    opts.ctx.res.status(StatusCode.OK);
  }),
  edit: protectedProcedure.input(editInput).mutation(async (opts) => {
    const { id, content } = opts.input;
    const userId = opts.ctx.userId;

    const creator = await isCreator({ id, userId });
    if (!creator) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not the creator of this comment',
      });
    }

    await edit({ id, content });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
});
