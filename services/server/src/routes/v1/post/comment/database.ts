import { prisma } from '@s/core/lib/prisma.js';

import {
  EditInput,
  InfiniteInput,
  ProtectedCreateInput,
  ProtectedLikeInput,
  RemoveInput,
} from './validators.js';

export const getInfinite = async ({
  postId,
  limit,
  cursor,
  userId,
}: InfiniteInput) => {
  const comments = await prisma.comment.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'desc' },
    select: {
      id: true,
      content: true,
      _count: {
        select: { likes: true },
      },
      userId: true,
    },
    where: {
      postId,
    },
  });

  // Maximum limit is low
  return comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    likes: comment._count.likes,
    creator: comment.userId === userId,
  }));
};

export const like = async ({ id, userId }: ProtectedLikeInput) => {
  await prisma.commentLikes.create({
    data: {
      commentId: id,
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

export const remove = async ({ id }: RemoveInput) => {
  return await prisma.comment.delete({ where: { id } });
};

export const edit = async ({ id, content }: EditInput) => {
  return await prisma.comment.update({
    data: { content },
    where: { id },
  });
};
