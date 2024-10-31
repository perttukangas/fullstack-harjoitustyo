import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { router } from 'express-file-routing';

import { PORT } from './core/lib/envalid';

import morgan from 'morgan';
import { info } from './core/utils/logger';

async function startServer() {
  info('Starting server...');

  const app = express();

  app.use(
    morgan(
      '[EXPRESS] :method :url :status :res[content-length] - :response-time ms'
    )
  );

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

startServer();
