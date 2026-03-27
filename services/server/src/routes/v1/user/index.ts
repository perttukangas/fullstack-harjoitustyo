import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import type { SessionSchema } from '@shared/zod/user.js';
import { loginSignupInput } from '@shared/zod/user.js';

import { AUTH_SECRET } from '@sc/lib/envalid.js';
import { prisma } from '@sc/lib/prisma.js';
import { StatusCode } from '@sc/utils/status-code.js';

import { SESSION_TOKEN_COOKIE } from '@apiv1/trpc/auth.js';
import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@apiv1/trpc/index.js';

const sessionTokenCookieOptions = {
  secure: true,
  sameSite: 'strict' as const,
  signed: true,
  httpOnly: true,
};

const createInvalidCredentialsError = () =>
  new TRPCError({
    code: 'UNAUTHORIZED',
    message: 'Invalid email or password',
  });

const findUserByEmail = async (email: string) => {
  return prisma.user.findFirst({
    where: {
      email,
    },
  });
};

const findValidUserByCredentials = async (email: string, password: string) => {
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatches) {
    return null;
  }

  return existingUser;
};

const createSessionToken = (userId: SessionSchema['id']) => {
  const tokenContent: SessionSchema = { id: userId };
  const token = jwt.sign(tokenContent, AUTH_SECRET);

  return {
    token,
    tokenContent,
  };
};

const isAuthorizedByToken = (token: string) => {
  try {
    jwt.verify(token, AUTH_SECRET);
    return true;
  } catch {
    return false;
  }
};

export const userRouter = router({
  login: publicProcedure.input(loginSignupInput).mutation(async (opts) => {
    const { email, password } = opts.input;

    const user = await findValidUserByCredentials(email, password);
    if (!user) {
      throw createInvalidCredentialsError();
    }

    const { token, tokenContent } = createSessionToken(user.id);

    opts.ctx.res.cookie(SESSION_TOKEN_COOKIE, token, sessionTokenCookieOptions);

    return tokenContent;
  }),
  signup: publicProcedure.input(loginSignupInput).mutation(async (opts) => {
    const { email, password } = opts.input;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User with the same email exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    opts.ctx.res.status(StatusCode.CREATED);
  }),
  authorized: publicProcedure.query(async (opts) => {
    // This is not an user input
    // eslint-disable-next-line security/detect-object-injection
    const token = opts.ctx.req.signedCookies[SESSION_TOKEN_COOKIE];

    if (!token) {
      return false;
    }

    return isAuthorizedByToken(token);
  }),
  logout: protectedProcedure.mutation(async (opts) => {
    opts.ctx.res.clearCookie(SESSION_TOKEN_COOKIE, sessionTokenCookieOptions);

    opts.ctx.res.status(StatusCode.OK);
  }),
});
