import { prisma } from './index.js';

export const getPage = async (
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
    },
  });
};
