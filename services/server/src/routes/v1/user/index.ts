import { z } from 'zod';

import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@s/core/lib/trpc/index.js';

export const userRouter = router({
  login: publicProcedure.input(z.void()).query(async () => {
    return '1 ok';
  }),
  register: publicProcedure.input(z.void()).query(async () => {
    return '2 ok';
  }),
  protectedTest: protectedProcedure.input(z.void()).query(async () => {
    return '3 ok';
  }),
});
