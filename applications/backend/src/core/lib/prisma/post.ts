import { prisma } from '.';

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

export const getOne = async (id: number) => {
  return await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
    },
  });
};
