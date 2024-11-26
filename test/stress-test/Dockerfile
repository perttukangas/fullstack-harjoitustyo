FROM node:23-alpine3.20@sha256:d03e75e7ba1385c2944f4cc374eb5abe0715234f87da5121dbd64f7262ad10df AS builder

WORKDIR /usr/src/app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM grafana/k6:0.54.0@sha256:1f40432b1cbe7234e977f96c362c9bc550a2d2b583d014dd8669fe40d3e9e755 AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist .

ENTRYPOINT ["k6"]