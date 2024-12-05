import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';

import { sessionSchema } from '@shared/zod/user.js';

import { AUTH_SECRET } from '@sc/lib/envalid.js';

export const SESSION_TOKEN_COOKIE = 'AUTH_SESSION_TOKEN';

export const createContext = async (opts: CreateExpressContextOptions) => {
  async function getUserFromCookie() {
    // This is not an user input
    // eslint-disable-next-line security/detect-object-injection
    const authHeader = opts.req.signedCookies[SESSION_TOKEN_COOKIE];
    if (authHeader) {
      const userJwtPayload = jwt.verify(authHeader, AUTH_SECRET);
      const session = sessionSchema.parse(userJwtPayload);
      return session.id;
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
