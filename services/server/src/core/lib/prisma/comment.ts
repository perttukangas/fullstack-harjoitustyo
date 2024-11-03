import { prisma } from '.';

export const getPage = async (
  postId: number,
  cursor: number,
  pageSize: number
) => {
  return await prisma.comment.findMany({
    where: { postId },
    skip: cursor,
    take: pageSize,
    orderBy: { id: 'desc' },
    select: {
      id: true,
      content: true,
    },
  });
};
