import { prisma } from '../../../../../core/lib/prisma';

export const getPage = async (cursor: number, pageSize: number) => {
  return await prisma.post.findMany({
    skip: cursor,
    take: pageSize,
    orderBy: { id: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
    },
  });
};
