FROM node:22-alpine3.20 AS builder

WORKDIR /usr/src/app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM grafana/k6:0.55.0 AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist .

ENTRYPOINT ["k6"]