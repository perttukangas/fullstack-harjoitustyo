import 'instrument.js';

import * as Sentry from '@sentry/node';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { doubleCsrf } from 'csrf-csrf';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import {
  CLIENT_URL,
  COOKIE_SECRET,
  CSRF_SECRET,
  PORT,
  isDev,
} from '@s/core/lib/envalid.js';
import { LogLevel, error, info, shouldLog } from '@s/core/utils/logger.js';

import { trpcMiddleware } from '@apiv1/trpc/middleware.js';

async function main() {
  info('Starting server...');

  const app = express();

  app.use(helmet());

  if (!isDev) {
    app.use(express.static('static'));
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
    })
  );

  const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => CSRF_SECRET,
    cookieName: isDev ? 'x-csrf-token' : '__Host-auth.x-csrf-token',
    cookieOptions: {
      sameSite: 'strict',
      path: '/',
      secure: true,
      signed: true,
    },
  });

  app.use(
    cookieParser(COOKIE_SECRET, {
      // Typing here is wrong as cookier parser second argument uses npm:cookie, which has sameSite
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      signed: true,
    })
  );

  app.use(doubleCsrfProtection);

  if (shouldLog(LogLevel.INFO)) {
    app.use(
      morgan(
        '[TRAFFIC] :method :url :status :res[content-length] - :response-time ms'
      )
    );
  }

  app.get('/api/csrf', (req: express.Request, res: express.Response) => {
    res.json({ token: generateToken(req, res) });
  });
  app.use('/api/v1', trpcMiddleware);

  // After controllers, before any error handler
  app.use(Sentry.expressErrorHandler());

  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      // Required for Express to interpret this as an error handler.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _next: express.NextFunction
    ) => {
      if (shouldLog(LogLevel.ERROR)) {
        error(err);
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  );

  app.listen(PORT, () => {
    info(`Server is running on port ${PORT}`);
  });
}

void main();
