#!/bin/bash

docker compose -f ../docker/docker-compose.dev.yml up -d --build
DATABASE_CONTAINER="dev-db"
until docker exec $DATABASE_CONTAINER /cockroach/cockroach sql --insecure --execute="SELECT 1" ; do sleep 1 ; done

trap "docker compose -f ../docker/docker-compose.dev.yml down" INT TERM

(cd ../services/server && npm run dev) &
server_pid=$!

(cd ../services/client && npm run dev) &
client_pid=$!

wait $server_pid
wait $client_pid

# For funny business
docker compose -f ../docker/docker-compose.dev.yml down