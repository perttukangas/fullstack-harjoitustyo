import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { CLIENT_URL, PORT } from '@s/core/lib/envalid.js';
import { LogLevel, info, shouldLog } from '@s/core/utils/logger.js';

import { trpcMiddleware } from '@apiv1/trpc/middleware.js';

async function main() {
  info('Starting server...');

  const app = express();

  app.use(helmet());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
    })
  );

  if (shouldLog(LogLevel.INFO)) {
    app.use(
      morgan(
        '[TRAFFIC] :method :url :status :res[content-length] - :response-time ms'
      )
    );
  }

  app.use('/api/v1', trpcMiddleware);

  app.listen(PORT, () => {
    info(`Server is running on port ${PORT}`);
  });
}

void main();
