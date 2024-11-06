import { z } from 'zod';

import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@apiv1/trpc/index.js';

import { loginValidator, registerValidator } from './validators.js';

export const userRouter = router({
  login: publicProcedure.input(loginValidator).query(async () => {
    return '1 ok';
  }),
  register: publicProcedure.input(registerValidator).query(async () => {
    return '2 ok';
  }),
  protectedTest: protectedProcedure.input(z.void()).query(async () => {
    return '3 ok';
  }),
});
