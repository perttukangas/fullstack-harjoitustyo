import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { authMiddleware } from '@s/core/lib/auth/middleware.js';
import { PORT } from '@s/core/lib/envalid/index.js';
import { trpcMiddleware } from '@s/core/lib/trpc/middleware.js';
import { LogLevel, info, shouldLog } from '@s/core/utils/logger.js';

async function main() {
  info('Starting server...');

  const app = express();
  app.use(helmet());
  app.use(express.json());

  app.set('trust proxy', true);

  if (shouldLog(LogLevel.INFO)) {
    app.use(
      morgan(
        '[TRAFFIC] :method :url :status :res[content-length] - :response-time ms'
      )
    );
  }

  app.use('/api/auth/*', authMiddleware);
  app.use('/api/v1', trpcMiddleware);

  app.listen(PORT, () => {
    info(`Server is running on port ${PORT}`);
  });
}

void main();
