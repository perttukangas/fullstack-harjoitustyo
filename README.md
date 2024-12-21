# Fullstack project

Simple post and comment web app with focus on infra rather than the app functionality itself. For more information see [about project](#about-project) at the bottom.

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

## About project

Work hours can be found [here](work-hours.md). They explain pretty well the flow of this project, and what has been done. Here is table of things that I want mention in somewhat categories.

| Global                                                             | Server - Client                | Server                                                                                  | Client                                                                  |
| ------------------------------------------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Dockerized development environment with hotloads                   | tRPC for type-safe APIs        | Prisma ORM for database management                                                      | React with TypeScript                                                   |
| Fully declarative Kubernetes deployment (development version only) | Schema validation via Zod      | CockroachDB for scalable database (PostgreSQL removed while doing k8s conversion)       | TailwindCSS for styling                                                 |
| CI/CD with GitHub Actions                                          | Double CSRF                    | Sentry for monitoring and profiling                                                     | Infinite scrolling with virtualizer (TanStack)                          |
| Dependabot for dependency updates                                  | Helmet for more secure HTTP    | Rate limiting with Traefik (rate limit removed from Express while doing k8s conversion) | Code splitting and prefetching                                          |
| CodeQL integration                                                 | Stress testing with k6         | Horizontal auto-scaling                                                                 | Responsive and accessible UI with ShadCN components (utilizes radix-ui) |
| Husky and lint staged (Prettier and ESlint)                        | Site analyzing with Lighthouse | Env validation                                                                          | File path based routing                                                 |

### Functionality

Functionality of the app can be simplified down to the following

| Non-logged user                             | User                                                   | Post                    | Comment                            |
| ------------------------------------------- | ------------------------------------------------------ | ----------------------- | ---------------------------------- |
| See any post or comment, but can't interact | Register and login                                     | Create, like and unlike | Create, like and unlike            |
|                                             | Only logger in user can create etc. posts and comments | Edit if creator         | Edit if creator                    |
|                                             |                                                        | Delete if creator       | Delete if creator or owner of post |

### Simple usage instructions

1. Click `profile` icon at footer > signup > enter email and password > changes to login modal > enter email and password used to signup
2. Click `plus` icon at footer > enter title and content (make at least 3 posts)
3. Click `heart` icon at one post > press it again to unlike
4. Click `pencil` icon at one post > modify a bit and submit
5. Click `message` icon at one post > repeat steps 2, 3 and 4 for comments
6. Click `profile` icon at footer
7. Click `expand` icon at post you created comments on > select all > upmost `trash` icon in comment table deletes all selected
8. Click `trash` icon at some of the posts > delete it
9. Click `home` icon at footer > post has disappeared
10. Click `shutdown` icon at footer > logs out
11. Posts and comments are now on readonly view
