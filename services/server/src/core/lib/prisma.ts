import { PrismaClient } from '@prisma/client';

import { NODE_ENV } from '@s/core/lib/envalid.js';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient().$extends({
    result: {
      user: {
        password: {
          needs: {},
          compute() {
            return undefined;
          },
        },
      },
    },
  });

if (NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
