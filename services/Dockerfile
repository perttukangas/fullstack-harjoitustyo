FROM node:23-alpine3.20@sha256:d03e75e7ba1385c2944f4cc374eb5abe0715234f87da5121dbd64f7262ad10df AS builder

# CI build time args
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

WORKDIR /usr/src/app

COPY tsconfig.json ./

# SERVER
# Package lock files layer
COPY ./server/package*.json ./server/
RUN cd ./server && npm ci

# Rest of the server layer
COPY ./server/ ./server/
RUN cd ./server && npm run build

# Run Sentry sourcemaps upload if CI
RUN if [ -n "$SENTRY_AUTH_TOKEN" ]; then cd ./server && npm run sentry:sourcemaps; fi

# Clean sourcemaps so they aren't in final build
RUN cd ./server && find ./dist -name "*.js.map" -type f -delete

# CLIENT
# Package lock files layer
COPY ./client/package*.json ./client/
RUN cd ./client && npm ci

# Rest of the client layer
COPY ./client ./client
RUN cd ./client && npm run build

RUN cd ./server && npm prune --omit=dev

FROM node:23-alpine3.20@sha256:d03e75e7ba1385c2944f4cc374eb5abe0715234f87da5121dbd64f7262ad10df AS runner

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/client/dist ./static

COPY --chown=node:node --from=builder /usr/src/app/server/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/server/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/server/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/server/prisma/migrations ./prisma/migrations
COPY --chown=node:node --from=builder /usr/src/app/server/prisma/schema.prisma ./prisma/schema.prisma

USER node

CMD [ "npm", "run", "start" ]