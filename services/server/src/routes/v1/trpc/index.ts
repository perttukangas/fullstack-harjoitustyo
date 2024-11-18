import * as Sentry from '@sentry/node';
import { TRPCError, initTRPC } from '@trpc/server';

import { Context } from './auth.js';

const t = initTRPC.context<Context>().create();

const sentryMiddleware = t.middleware(Sentry.trpcMiddleware());

export const router = t.router;

export const publicProcedure = t.procedure
  .use(sentryMiddleware)
  .use(function isAuthed(opts) {
    // Nullable here
    const userId = opts.ctx.userId ?? undefined;
    return opts.next({
      ctx: {
        userId,
      },
    });
  });

export const protectedProcedure = t.procedure
  .use(sentryMiddleware)
  .use(function isAuthed(opts) {
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
