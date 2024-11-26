FROM node:23-alpine3.20@sha256:d03e75e7ba1385c2944f4cc374eb5abe0715234f87da5121dbd64f7262ad10df AS builder

WORKDIR /usr/src/app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM grafana/k6:0.55.0@sha256:b24f418fc99a26dd57904c952c03bfaf79462be18508acc45aafa07ff68e7df2 AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist .

ENTRYPOINT ["k6"]