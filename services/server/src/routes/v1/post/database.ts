import { prisma } from '@s/core/lib/prisma.js';

import {
  InfiniteInput,
  ProtectedCreateInput,
  ProtectedLikeInput,
} from './validators.js';

export const getInfinite = async ({ limit, cursor }: InfiniteInput) => {
  return await prisma.post.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      _count: {
        select: { likes: true },
      },
    },
  });
};

export const like = async ({ postId, userId }: ProtectedLikeInput) => {
  return await prisma.postLikes.create({
    data: {
      postId,
      userId,
    },
  });
};

export const create = async ({
  title,
  content,
  userId,
}: ProtectedCreateInput) => {
  return await prisma.post.create({
    data: {
      title,
      content,
      userId,
    },
  });
};
