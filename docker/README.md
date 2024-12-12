# Docker

Docker composes for development.

Any compose can be:

- Built or rebuilt: `docker compose -f <file> build`
- Started: `docker compose -f <file> up`
  - For `docker-compose.dev.yml`: `docker compose -f <file> up --watch`
- Built/rebuilt and started: `docker compose -f <file> up --build`
  - For `docker-compose.dev.yml`: `docker compose -f <file> up --build --watch`
- Cleaned: `docker compose -f file down -v`

Clarifications:

- `docker-compose.dev.yml`

  - Spins up base development environment with hotloads via watch.
  - When to rebuild: package.json or Prisma schema changes
  - Client: `localhost:3002`
  - Server: `localhost:3003`

- `docker-compose.dev-db-only.yml`

  - Spins up development database only.
  - When to use: if you don't want to use `docker-compose.dev.yml`. `Server` and `client` can be started in their own terminals using `npm run dev`.
  - Client: `localhost:3002`
  - Server: `localhost:3003`

- `docker-compose.all.yml`

  - Spins up base test environment. Note that this is built version of app.
  - Client and server: `localhost:3005`

- `docker-compose.all-limited.yml`

  - Same as `docker-compose.all.yml`, but with limited resources. Used with stress tests.

- `docker-compose.site-analyzer.yml`

  - Runs Lighthouse tests to `localhost:3005`, and produces reports to `test/site-analyzer/reports` folder. Note that this requires `docker-compose.all*.yml` to be up.

- `docker-compose.stress-test.yml`

  - Runs stress tests to `localhost:3005`, and exits success or failure exit code. Note that this requires `docker-compose.all-limited.yml` to be up.

- `docker-compose.stress-test-k8s.yml`

  - Runs stress tests to `localhost:8081`, and exits success or failure exit code. Note that this requires local cluster to be up, see `k8s/README.md`.
