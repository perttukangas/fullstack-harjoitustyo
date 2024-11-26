import { PrismaClient } from '@prisma/client';

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
