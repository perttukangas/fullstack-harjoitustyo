import { createExpressMiddleware } from '@trpc/server/adapters/express';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { PORT } from '@core/lib/envalid/index.js';
import { LogLevel, info, shouldLog } from '@core/utils/logger.js';

import { appRouter } from './routes/v1/routes.js';

async function main() {
  info('Starting server...');

  const app = express();
  app.use(helmet());
  app.use(express.json());

  if (shouldLog(LogLevel.INFO)) {
    app.use(
      morgan(
        '[TRAFFIC] :method :url :status :res[content-length] - :response-time ms'
      )
    );
  }

  app.use(
    '/api/v1',
    createExpressMiddleware({
      router: appRouter,
    })
  );

  app.listen(PORT, () => {
    info(`Server is running on port ${PORT}`);
  });
}

void main();
