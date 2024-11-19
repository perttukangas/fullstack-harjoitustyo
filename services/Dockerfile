FROM node:22-alpine3.20 AS builder

WORKDIR /usr/src/app

COPY . .

RUN cd ./server \
  && npm ci \
  && npx prisma generate \
  && npm run build

RUN cd ./client \
  && npm ci \
  && npm run build

RUN cd ./server \
  && npm prune --omit=dev

FROM node:22-alpine3.20 AS runner

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/client/dist ./static

COPY --chown=node:node --from=builder /usr/src/app/server/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/server/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/server/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/server/prisma/migrations ./prisma/migrations
COPY --chown=node:node --from=builder /usr/src/app/server/prisma/schema.prisma ./prisma/schema.prisma

USER node

CMD [ "npm", "run", "start" ]