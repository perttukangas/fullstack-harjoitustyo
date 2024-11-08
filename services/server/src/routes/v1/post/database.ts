import { prisma } from '@s/core/lib/prisma.js';

export const getInfinite = async (
  cursor: number | undefined | null,
  pageSize: number
) => {
  return await prisma.post.findMany({
    take: pageSize + 1,
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

export const like = async (postId: number, userId: number) => {
  await prisma.postLikes.create({
    data: {
      postId,
      userId,
    },
  });
};
