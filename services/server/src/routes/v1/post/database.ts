import { prisma } from '@s/core/lib/prisma.js';

import {
  EditInput,
  InfiniteInput,
  ProtectedCreateInput,
  ProtectedLikeInput,
  RemoveInput,
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

export const remove = async ({ postId }: RemoveInput) => {
  return await prisma.post.delete({ where: { id: postId } });
};

export const edit = async ({ postId, title, content }: EditInput) => {
  return await prisma.post.update({
    data: { title, content },
    where: { id: postId },
  });
};
