import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';

import { AUTH_SECRET } from '@s/core/lib/envalid.js';

interface TokenUser {
  userId: number;
}

export const createContext = async (opts: CreateExpressContextOptions) => {
  async function getUserFromHeader() {
    const authHeader = opts.req.headers.authorization;
    if (authHeader && authHeader.startsWith('bearer ')) {
      const user = jwt.verify(
        authHeader.split(' ')[1],
        AUTH_SECRET
      ) as TokenUser;
      return user.userId;
    }
    return null;
  }
  const userId = await getUserFromHeader();
  return {
    userId,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
