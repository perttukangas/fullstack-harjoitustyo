import { TRPCError } from '@trpc/server';

import {
  createInput,
  editInput,
  infiniteInput,
  likeUnlikeInput,
  removeInput,
  removeManyInput,
} from '@shared/zod/comment.js';

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
  getInfiniteCreator,
  hasLiked,
  isCreator,
  isCreatorOrOwnerOfPost,
  like,
  remove,
  removeMany,
  unlike,
} from './database.js';

type CursorEntity = {
  id: bigint;
};

const getForwardPaginationResult = <T extends CursorEntity>(
  items: T[],
  limit: number
) => {
  let nextCursor: bigint | undefined = undefined;
  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem?.id;
  }

  return {
    items,
    nextCursor,
  };
};

const getBidirectionalPaginationResult = <T extends CursorEntity>(
  items: T[],
  limit: number,
  direction: 'forward' | 'backward' | undefined,
  cursor: bigint | null | undefined
) => {
  const hasMore = items.length > limit;
  if (hasMore) {
    if (direction === 'forward') {
      items.pop();
    } else {
      items.shift();
    }
  }

  let nextCursor = items.length > 0 ? items[items.length - 1].id : undefined;
  let previousCursor = items.length > 0 ? items[0].id : undefined;

  if (!hasMore) {
    if (direction === 'forward') {
      nextCursor = undefined;
    } else if (direction === 'backward') {
      previousCursor = undefined;
    }
  }

  if (!cursor) {
    previousCursor = undefined;
  }

  return {
    items,
    nextCursor,
    previousCursor,
  };
};

const assertConflict = (condition: boolean, message: string) => {
  if (condition) {
    throw new TRPCError({
      code: 'CONFLICT',
      message,
    });
  }
};

const assertAuthorized = (condition: boolean, message: string) => {
  if (!condition) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message,
    });
  }
};

export const commentRouter = router({
  infinite: publicProcedure.input(infiniteInput).query(async (opts) => {
    const { limit, cursor, postId } = opts.input;
    const userId = opts.ctx.userId;

    const comments = await getInfinite({ postId, limit, cursor, userId });

    const { items, nextCursor } = getForwardPaginationResult(comments, limit);

    return {
      comments: items,
      nextCursor,
    };
  }),
  infiniteCreator: protectedProcedure
    .input(infiniteInput)
    .query(async (opts) => {
      const { limit, cursor, direction, postId } = opts.input;

      // No need for user id check here since this is used in profile page
      // where user only requests posts based on his own post ids
      const comments = await getInfiniteCreator({
        postId,
        limit,
        cursor,
        direction,
      });

      const { items, nextCursor, previousCursor } =
        getBidirectionalPaginationResult(comments, limit, direction, cursor);

      return {
        comments: items,
        nextCursor,
        previousCursor,
      };
    }),
  like: protectedProcedure.input(likeUnlikeInput).mutation(async (opts) => {
    const { id } = opts.input;
    const userId = opts.ctx.userId;

    const liked = await hasLiked({ id, userId });
    assertConflict(liked, 'You have already liked this comment');

    await like({ id, userId });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
  unlike: protectedProcedure.input(likeUnlikeInput).mutation(async (opts) => {
    const { id } = opts.input;
    const userId = opts.ctx.userId;

    const liked = await hasLiked({ id, userId });
    assertConflict(!liked, 'You have not liked this comment');

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

    const creator = await isCreatorOrOwnerOfPost({ id, userId });
    assertAuthorized(
      creator,
      'You are not the creator of this comment or the post'
    );

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
          message: `Successfully removed ${removed.count}/${ids.length} of comments`,
        });
      }

      opts.ctx.res.status(StatusCode.OK);
    }),
  edit: protectedProcedure.input(editInput).mutation(async (opts) => {
    const { id, content } = opts.input;
    const userId = opts.ctx.userId;

    const creator = await isCreator({ id, userId });
    assertAuthorized(creator, 'You are not the creator of this comment');

    await edit({ id, content });
    opts.ctx.res.status(StatusCode.CREATED);
  }),
});
