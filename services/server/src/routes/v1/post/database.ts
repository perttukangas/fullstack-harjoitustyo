import { prisma } from '@s/core/lib/prisma.js';

import {
  EditInput,
  InfiniteInput,
  ProtectedCreateInput,
  ProtectedLikeInput,
  RemoveInput,
} from './validators.js';

export const getInfinite = async ({ limit, cursor, userId }: InfiniteInput) => {
  const posts = await prisma.post.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      _count: {
        select: { likes: true, comments: true },
      },
      userId: true,
    },
  });

  // Maximum limit is low
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    likes: post._count.likes,
    comments: post._count.comments,
    creator: post.userId === userId,
  }));
};

export const like = async ({ id, userId }: ProtectedLikeInput) => {
  return await prisma.postLikes.create({
    data: {
      postId: id,
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

export const remove = async ({ id }: RemoveInput) => {
  return await prisma.post.delete({ where: { id } });
};

export const edit = async ({ id, title, content }: EditInput) => {
  return await prisma.post.update({
    data: { title, content },
    where: { id },
  });
};
