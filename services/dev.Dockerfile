FROM node:23-alpine3.20@sha256:0e5b53891ddbf3c4924077990f037ff55d981d030648345574cd1cb0e4a524bb

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