import {
  EditInput,
  InfiniteCreatorInput,
  InfiniteInput,
  ProtectedCreateInput,
  ProtectedLikeUnlikeInput,
  ProtectedRemoveManyInput,
  RemoveInput,
} from '@shared/zod/post.js';

import { prisma } from '@sc/lib/prisma.js';

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
  });

  // Maximum limit is low
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    likes: post._count.likes,
    comments: post._count.comments,
    creator: post.userId === userId,
    liked: post.likes?.length > 0,
  }));
};

export const getInfiniteCreator = async ({
  limit,
  cursor,
  direction,
  userId,
}: InfiniteCreatorInput) => {
  return await prisma.post.findMany({
    take: direction === 'backward' ? -(limit + 1) : limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    where: {
      userId,
    },
  });
};

export const like = async ({ id, userId }: ProtectedLikeUnlikeInput) => {
  return await prisma.postLikes.create({
    data: {
      postId: id,
      userId,
    },
  });
};

export const unlike = async ({ id, userId }: ProtectedLikeUnlikeInput) => {
  return await prisma.postLikes.delete({
    where: {
      postId_userId: {
        postId: id,
        userId,
      },
    },
  });
};

export const hasLiked = async ({
  id,
  userId,
}: {
  id: bigint;
  userId: bigint;
}) => {
  const postLike = await prisma.postLikes.findFirst({
    where: {
      postId: id,
      userId,
    },
  });

  return !!postLike;
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

export const removeMany = async ({ ids, userId }: ProtectedRemoveManyInput) => {
  return await prisma.post.deleteMany({
    where: {
      id: {
        in: ids,
      },
      userId,
    },
  });
};

export const edit = async ({ id, title, content }: EditInput) => {
  return await prisma.post.update({
    data: { title, content },
    where: { id },
  });
};

export const isCreator = async ({
  id,
  userId,
}: {
  id: bigint;
  userId: bigint;
}) => {
  const post = await prisma.post.findFirst({
    where: {
      id,
      userId,
    },
  });

  return !!post;
};
