import { prisma } from '@s/core/lib/prisma.js';

export const getPage = async (
  postId: number,
  cursor: number | undefined | null,
  pageSize: number
) => {
  return await prisma.comment.findMany({
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'desc' },
    select: {
      id: true,
      content: true,
    },
    where: {
      postId,
    },
  });
};
