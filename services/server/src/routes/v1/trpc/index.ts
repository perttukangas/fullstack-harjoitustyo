import { TRPCError, initTRPC } from '@trpc/server';

import { Context } from './auth.js';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(function isAuthed(opts) {
  const userId = opts.ctx.userId;
  if (!userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  return opts.next({
    ctx: {
      userId,
    },
  });
});