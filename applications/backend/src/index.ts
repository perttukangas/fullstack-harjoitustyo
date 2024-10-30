import express from 'express';
import { router } from 'express-file-routing';

async function startServer() {
  const app = express();
  const PORT = 3003;

  const routes = await router();

  console.log(
    'Paths',
    routes.stack.map((r) => r.route?.path)
  );

  app.use('/', routes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
