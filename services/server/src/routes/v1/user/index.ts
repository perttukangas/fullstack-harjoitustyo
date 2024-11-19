import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { AUTH_SECRET, isDev } from '@s/core/lib/envalid.js';
import { prisma } from '@s/core/lib/prisma.js';
import { StatusCode } from '@s/core/utils/status-code.js';

import { SESSION_TOKEN_COOKIE } from '@apiv1/trpc/auth.js';
import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@apiv1/trpc/index.js';

import { loginSignupInput } from './validators.js';

export const userRouter = router({
  login: publicProcedure.input(loginSignupInput).mutation(async (opts) => {
    const { email, password } = opts.input;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    const tokenContent = { id: existingUser.id };
    const token = jwt.sign(tokenContent, AUTH_SECRET);

    opts.ctx.res.cookie(SESSION_TOKEN_COOKIE, token, {
      secure: true,
      sameSite: 'strict',
      signed: true,
      httpOnly: true,
    });

    return tokenContent;
  }),
  signup: publicProcedure.input(loginSignupInput).mutation(async (opts) => {
    const { email, password } = opts.input;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

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

    try {
      jwt.verify(token, AUTH_SECRET);
      return true;
    } catch {
      return false;
    }
  }),
  logout: protectedProcedure.mutation(async (opts) => {
    opts.ctx.res.clearCookie(SESSION_TOKEN_COOKIE, {
      secure: true,
      sameSite: 'strict',
      signed: true,
      httpOnly: true,
    });

    opts.ctx.res.status(StatusCode.OK);
  }),
});
