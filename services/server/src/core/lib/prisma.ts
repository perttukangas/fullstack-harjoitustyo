import { PrismaClient } from '@prisma/client';

import { NODE_ENV } from '@sc/lib/envalid.js';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
