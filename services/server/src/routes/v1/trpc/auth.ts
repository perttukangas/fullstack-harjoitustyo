import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';

import { AUTH_SECRET } from '@s/core/lib/envalid.js';

interface TokenUser {
  userId: number;
}

export const SESSION_TOKEN_COOKIE = 'AUTH_SESSION_TOKEN';

export const createContext = async (opts: CreateExpressContextOptions) => {
  async function getUserFromHeader() {
    const authHeader = opts.req.cookies.SESSION_TOKEN_COOKIE;
    if (authHeader) {
      const user = jwt.verify(authHeader, AUTH_SECRET) as TokenUser;
      return user.userId;
    }
    return null;
  }
  const userId = await getUserFromHeader();
  return {
    userId,
    req: opts.req,
    res: opts.res,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
