import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';

import { AUTH_SECRET } from '@s/core/lib/envalid.js';

interface TokenUser {
  userId: number;
}

export const SESSION_TOKEN_COOKIE = 'AUTH_SESSION_TOKEN';

export const createContext = async (opts: CreateExpressContextOptions) => {
  async function getUserFromCookie() {
    // This is not an user input
    // eslint-disable-next-line security/detect-object-injection
    const authHeader = opts.req.signedCookies[SESSION_TOKEN_COOKIE];
    if (authHeader) {
      const user = jwt.verify(authHeader, AUTH_SECRET) as TokenUser;
      return user.userId;
    }
    return null;
  }
  const userId = await getUserFromCookie();
  return {
    userId,
    req: opts.req,
    res: opts.res,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
