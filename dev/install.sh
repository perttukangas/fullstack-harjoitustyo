#!/bin/bash

# ENVIRONMENT VARIABLES

ENV_FILE=../services/server/.env
if [ ! -f $ENV_FILE ]; then
  touch $ENV_FILE
fi

add_if_not_exists() {
  local var_name=$1
  local var_value=$2
  local var_explaination=$3
  if ! grep -q "^$var_name=" "$ENV_FILE"; then
    echo "" >> "$ENV_FILE"
    echo "# $var_explaination" >> "$ENV_FILE"
    echo "$var_name=$var_value" >> "$ENV_FILE"
  fi
}

add_if_not_exists "DATABASE_URL" "postgresql://admin:password@localhost:5433/fullstack-db-dev?schema=public" "Required for Prisma"
add_if_not_exists "NODE_ENV" "development" "Defines the environment type"
add_if_not_exists "PORT" "3003" "Port for the backend server"

# BACKEND

docker compose -f docker-compose.dev.yml up -d --build
DATABASE_CONTAINER="postgres-dev"
until docker exec $DATABASE_CONTAINER pg_isready ; do sleep 1 ; done

cd ../services/server

npm install
npx prisma migrate dev
npx @snaplet/seed init prisma/seed
npx prisma db seed
docker compose -f ../../dev/docker-compose.dev.yml down

# FRONTEND
cd ../client

npm install