FROM node:22-alpine3.20@sha256:b64ced2e7cd0a4816699fe308ce6e8a08ccba463c757c00c14cd372e3d2c763e

WORKDIR /usr/src/app

COPY tsconfig.json ./

COPY ./package*.json ./
COPY ./shared/package*.json ./shared/
COPY ./server/package*.json ./server/
COPY ./client/package*.json ./client/

RUN npm install

COPY ./shared/ ./shared/
COPY ./server/ ./server/
COPY ./client/ ./client/