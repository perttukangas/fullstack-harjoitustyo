FROM node:23-alpine3.20@sha256:7bcf3a9f2f894ff2a9f699f93a969a58a0f26ad9471e40080d77ca76cd5cfe7e

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