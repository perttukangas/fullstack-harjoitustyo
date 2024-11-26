FROM node:22-alpine3.20@sha256:b64ced2e7cd0a4816699fe308ce6e8a08ccba463c757c00c14cd372e3d2c763e AS builder

WORKDIR /usr/src/app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM grafana/k6:0.55.0@sha256:b24f418fc99a26dd57904c952c03bfaf79462be18508acc45aafa07ff68e7df2 AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist .

ENTRYPOINT ["k6"]