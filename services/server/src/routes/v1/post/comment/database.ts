import { prisma } from '@s/core/lib/prisma.js';

import {
  EditInput,
  InfiniteInput,
  ProtectedCreateInput,
  ProtectedLikeInput,
  RemoveInput,
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

export const remove = async ({ commentId }: RemoveInput) => {
  return await prisma.comment.delete({ where: { id: commentId } });
};

export const edit = async ({ commentId, content }: EditInput) => {
  return await prisma.comment.update({
    data: { content },
    where: { id: commentId },
  });
};
