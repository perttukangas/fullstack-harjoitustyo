FROM node:22-alpine3.20@sha256:b64ced2e7cd0a4816699fe308ce6e8a08ccba463c757c00c14cd372e3d2c763e AS builder

WORKDIR /usr/src/app

COPY tsconfig.json ./

# SERVER
# Package lock files layer
COPY ./services/server/package*.json ./services/server/
RUN cd ./services/server && npm ci

# Prisma client layer
COPY ./services/server/prisma ./services/server/prisma/
RUN cd ./services/server && npx prisma generate

# Rest of the server layer
COPY ./services/server/ ./services/server/
RUN cd ./services/server && npm run build

# CLIENT
# Package lock files layer
COPY ./services/client/package*.json ./services/client/
RUN cd ./services/client && npm ci

# Rest of the client layer
COPY ./services/client ./services/client
RUN cd ./services/client && npm run build

RUN cd ./services/server && npm prune --omit=dev

FROM node:22-alpine3.20@sha256:b64ced2e7cd0a4816699fe308ce6e8a08ccba463c757c00c14cd372e3d2c763e AS runner

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/services/client/dist ./static

COPY --chown=node:node --from=builder /usr/src/app/services/server/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/services/server/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/services/server/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/services/server/prisma/migrations ./prisma/migrations
COPY --chown=node:node --from=builder /usr/src/app/services/server/prisma/schema.prisma ./prisma/schema.prisma

USER node

CMD [ "npm", "run", "start" ]