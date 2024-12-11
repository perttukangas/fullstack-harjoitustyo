FROM node:23-alpine3.20@sha256:7bcf3a9f2f894ff2a9f699f93a969a58a0f26ad9471e40080d77ca76cd5cfe7e AS builder

# CI build time args
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

WORKDIR /usr/src/app

COPY tsconfig.json ./

# PACKAGE JSONS
# Package lock files layer
COPY ./package*.json ./
COPY ./shared/package*.json ./shared/
COPY ./server/package*.json ./server/
COPY ./client/package*.json ./client/

RUN npm ci

# Rest of the shared layer
COPY ./shared/ ./shared/

# SERVER
COPY ./server/ ./server/
RUN cd ./server && npm run build

# Run Sentry sourcemaps upload if CI
RUN if [ -n "$SENTRY_AUTH_TOKEN" ] && [ -n "$SENTRY_ORG" ] && [ -n "$SENTRY_PROJECT" ]; then cd ./server && npm run sentry:sourcemaps; fi

# Clean sourcemaps so they aren't in final build
RUN cd ./server && find ./dist -name "*.js.map" -type f -delete

# CLIENT
# Rest of the client layer
COPY ./client ./client
RUN cd ./client && npm run build

FROM node:23-alpine3.20@sha256:7bcf3a9f2f894ff2a9f699f93a969a58a0f26ad9471e40080d77ca76cd5cfe7e AS node_modules

WORKDIR /usr/src/app

# PACKAGE JSONS
# Package lock files layer
COPY ./package*.json ./
COPY ./shared/package*.json ./shared/
COPY ./server/package*.json ./server/

RUN npm ci --omit=dev

COPY --chown=node:node --from=builder /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

FROM node:23-alpine3.20@sha256:7bcf3a9f2f894ff2a9f699f93a969a58a0f26ad9471e40080d77ca76cd5cfe7e AS runner

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/client/dist ./static

COPY --chown=node:node --from=node_modules /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/server/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/server/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/server/prisma ./prisma/

USER node

CMD [ "npm", "run", "start" ]