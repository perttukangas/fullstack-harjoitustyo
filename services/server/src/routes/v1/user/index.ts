import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { AUTH_SECRET } from '@s/core/lib/envalid.js';
import { prisma } from '@s/core/lib/prisma.js';

import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@apiv1/trpc/index.js';

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

      const token = jwt.sign({ userId: existingUser.id }, AUTH_SECRET);
      return { token };
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
          message: 'User with the same email or name already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign({ userId: user.id }, AUTH_SECRET);
      return { token };
    }),
  protectedTest: protectedProcedure.input(z.void()).query(async () => {
    return '3 ok';
  }),
});
