#!/bin/bash

docker compose -f docker-compose.dev.yml up -d --build
DATABASE_CONTAINER="postgres-dev"
until docker exec $DATABASE_CONTAINER pg_isready ; do sleep 1 ; done

trap "docker compose -f docker-compose.dev.yml down" INT TERM

(cd ../services/server && npm run dev) &
server_pid=$!

(cd ../services/client && npm run dev) &
client_pid=$!

wait $server_pid
wait $client_pid

# For funny business
docker compose -f docker-compose.dev.yml down