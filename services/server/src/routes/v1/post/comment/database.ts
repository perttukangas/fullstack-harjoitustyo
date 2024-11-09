import { prisma } from '@s/core/lib/prisma.js';

import {
  InfiniteInput,
  ProtectedCreateInput,
  ProtectedLikeInput,
} from './validators.js';

export const getInfinite = async ({ postId, limit, cursor }: InfiniteInput) => {
  return await prisma.comment.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'desc' },
    select: {
      id: true,
      content: true,
      _count: {
        select: { likes: true },
      },
    },
    where: {
      postId,
    },
  });
};

export const like = async ({ commentId, userId }: ProtectedLikeInput) => {
  await prisma.commentLikes.create({
    data: {
      commentId,
      userId,
    },
  });
};

export const create = async ({
  content,
  userId,
  postId,
}: ProtectedCreateInput) => {
  return await prisma.comment.create({
    data: {
      content,
      userId,
      postId,
    },
  });
};
