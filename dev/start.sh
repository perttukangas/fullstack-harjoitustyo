#!/bin/bash

docker compose -f docker-compose.dev.yml up -d --build
DATABASE_CONTAINER="postgres-dev"
until docker exec $DATABASE_CONTAINER pg_isready ; do sleep 1 ; done

trap "docker compose -f docker-compose.dev.yml down" INT TERM

(cd ../applications/backend && npm run dev) &
backend_pid=$!

(cd ../applications/frontend && npm run dev) &
frontend_pid=$!

wait $backend_pid
wait $frontend_pid

# For funny business
docker compose -f docker-compose.dev.yml down