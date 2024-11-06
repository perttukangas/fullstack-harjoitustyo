import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { AUTH_SECRET, isDev } from '@s/core/lib/envalid.js';
import { prisma } from '@s/core/lib/prisma.js';

import { SESSION_TOKEN_COOKIE } from '@apiv1/trpc/auth.js';
import { publicProcedure, router } from '@apiv1/trpc/index.js';

import { loginRegisterValidator } from './validators.js';

export const userRouter = router({
  login: publicProcedure
    .input(loginRegisterValidator)
    .mutation(async (opts) => {
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

      const tokenContent = { userId: existingUser.id };
      const token = jwt.sign({ userId: existingUser.id }, AUTH_SECRET);

      opts.ctx.res.cookie(SESSION_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: !isDev,
        sameSite: 'strict',
      });

      return tokenContent;
    }),
  register: publicProcedure
    .input(loginRegisterValidator)
    .mutation(async (opts) => {
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

      opts.ctx.res.status(201);
    }),
});
