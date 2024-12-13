# Fullstack project

Simple post and comment web app with focus on infra rather than the app functionality itself. See [some mentions about project](#some-mentions-about-project).

## Getting started

### Prerequisites

- Node.js (>v22)
- Docker (>v27)
- Docker Compose (>v2.31)

### Installation

- `npm run init-dev`

For additional installation and how to run in development see:

- [docker](docker/README.md) (local development)
- [k8s](k8s/README.md)
- [services](services/README.md)

### Setup production

Add following environment variables to CI/CD:

- `HEROKU_API_KEY`
- `HEROKU_APP_NAME`
- `HEROKU_EMAIL`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

Add following environment variables to Heroku:

- `AUTH_SECRET`
- `COOKIE_SECRET`
- `CSRF_SECRET`
- `DATABASE_URL`
  - Has to be CockroachDB due to didn't want to keep k8s in separate branch... and no credits for cluster. If PostgreSQL is desired: change provider to `postgresql` in `server/prisma/schema.prisma`, then delete `migrations` folder, and then run `npm run dev:migrate`. Note that migrate command requires running PostgreSQL database: modify docker composes to use PostgreSQL.
- `NODE_ENV=production`
- `SENTRY_AUTH_TOKEN`

## Some mentions about project

| Global                                                             | Server <-> Client              | Server                                                                                  | Client                                                                  |
| ------------------------------------------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Dockerized development environment with hotloads                   | tRPC for type-safe APIs        | Prisma ORM for database management                                                      | React with TypeScript                                                   |
| Fully declarative Kubernetes deployment (development version only) | Schema validation via Zod      | CockroachDB for scalable database (PostgreSQL removed while doing k8s conversion)       | TailwindCSS for styling                                                 |
| CI/CD with GitHub Actions                                          | Double CSRF                    | Sentry for monitoring and profiling                                                     | Infinite scrolling with virtualizer (TanStack)                          |
| Dependabot for dependency updates                                  | Helmet for more secure HTTP    | Rate limiting with Traefik (rate limit removed from Express while doing k8s conversion) | Code splitting and prefetching                                          |
| CodeQL integration                                                 | Stress testing with k6         | Horizontal auto-scaling                                                                 | Responsive and accessible UI with ShadCN components (utilizes radix-ui) |
| Husky and lint staged (Prettier and ESlint)                        | Site analyzing with Lighthouse | Env validation                                                                          | File path based routing                                                 |
