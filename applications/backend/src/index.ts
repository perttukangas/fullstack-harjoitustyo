import 'dotenv/config';

import express from 'express';
import { router } from 'express-file-routing';

import { PORT } from './core/lib/envalid';

import morgan from 'morgan';
import { info, LogLevel, shouldLog } from './core/utils/logger';

import helmet from 'helmet';

async function startServer() {
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

  info('Loading routes...');
  const routes = await router();
  app.use('/', routes);
  info(
    'Routes loaded',
    routes.stack.map((r) => r.route?.path)
  );

  app.listen(PORT, () => {
    info(`Server is running on port ${PORT}`);
  });
}

void startServer();
