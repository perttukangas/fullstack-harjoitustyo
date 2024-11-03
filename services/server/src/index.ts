import trpcExpress from '@trpc/server/adapters/express';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { PORT } from '@core/lib/envalid';
import { LogLevel, info, shouldLog } from '@core/utils/logger';

import { appRouter } from './routes/v1/routes';

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
    trpcExpress.createExpressMiddleware({
      router: appRouter,
    })
  );

  app.listen(PORT, () => {
    info(`Server is running on port ${PORT}`);
  });
}

void main();
