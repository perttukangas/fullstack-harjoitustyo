# Services FAQ

#### Types are not recognized

1. Restart VSC TypeScript server, and/or ESLint server
2. If TRPC has changed in server, in server folder `npm run dev:update`, and try step 1 again.

#### Database schema changed

1. Start database (e.g. `docker-compose.dev-db-only.yml`)
2. `npm run dev:migrate` in server folder
