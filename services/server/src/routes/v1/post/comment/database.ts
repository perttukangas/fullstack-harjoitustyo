import { prisma } from '@s/core/lib/prisma.js';

import {
  EditInput,
  InfiniteInput,
  ProtectedCreateInput,
  ProtectedLikeUnlikeInput,
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
      likes: userId
        ? {
            select: {
              userId: true,
            },
            where: {
              userId,
            },
            take: 1,
          }
        : undefined,
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
    liked: comment.likes?.length > 0,
  }));
};

export const like = async ({ id, userId }: ProtectedLikeUnlikeInput) => {
  await prisma.commentLikes.create({
    data: {
      commentId: id,
      userId,
    },
  });
};

export const unlike = async ({ id, userId }: ProtectedLikeUnlikeInput) => {
  return await prisma.commentLikes.delete({
    where: {
      commentId_userId: {
        commentId: id,
        userId,
      },
    },
  });
};

export const hasLiked = async ({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) => {
  const commentLike = await prisma.commentLikes.findFirst({
    where: {
      commentId: id,
      userId,
    },
  });

  return !!commentLike;
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

export const isCreator = async ({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) => {
  const comment = await prisma.comment.findFirst({
    where: {
      id,
      userId,
    },
  });

  return !!comment;
};
