import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

import { isDev, isProd, isTest } from '@sc/lib/envalid.js';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (!isProd) globalForPrisma.prisma = prisma;

/**
 * Clear the database, only for use in tests.
 * Does not clear Prisma migrations
 */
export const resetDatabase = async () => {
  if (!isTest && !isDev) {
    throw Error(
      'Tried to call clear database in other than test or dev, fix this'
    );
  }

  const tablenames = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  return tables;
};

export const simpleSeed = async () => {
  if (!isTest && !isDev) {
    throw Error(
      'Tried to call simple seed in other than test or dev, fix this'
    );
  }

  await resetDatabase();

  const hashedPassword = await bcrypt.hash('123456', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
    },
  });

  const posts = Array.from({ length: 100 }, (_, i) => ({
    title: `Post ${i + 1}`,
    content: `This is the content for post ${i + 1}`,
    userId: user.id,
  }));

  await prisma.post.createMany({
    data: posts,
  });
};
