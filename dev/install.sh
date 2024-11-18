#!/bin/bash

# ENVIRONMENT VARIABLES

SERVER_ENV_FILE=../services/server/.env
if [ ! -f $SERVER_ENV_FILE ]; then
  touch $SERVER_ENV_FILE
fi

add_if_not_exists() {
  local env_file=$1
  local var_name=$2
  local var_value=$3
  local var_explanation=$4
  if ! grep -q "^$var_name=" "$env_file"; then
    echo "" >> "$env_file"
    echo "# $var_explanation" >> "$env_file"
    echo "$var_name=$var_value" >> "$env_file"
  fi
}

add_if_not_exists $SERVER_ENV_FILE "DATABASE_URL" "postgresql://admin:password@localhost:5433/fullstack-db-dev?schema=public" "Required for Prisma"
add_if_not_exists $SERVER_ENV_FILE "NODE_ENV" "development" "Defines the environment type"
add_if_not_exists $SERVER_ENV_FILE "PORT" "3003" "Port for the backend server"
add_if_not_exists $SERVER_ENV_FILE "AUTH_SECRET" $(openssl rand -hex 32) "Secret for authentication"
add_if_not_exists $SERVER_ENV_FILE "CLIENT_URL" "http://localhost:3003" "Development frontend url"
add_if_not_exists $SERVER_ENV_FILE "COOKIE_SECRET" $(openssl rand -hex 32) "Secret for cookies"
add_if_not_exists $SERVER_ENV_FILE "CSRF_SECRET" $(openssl rand -hex 32) "Secret for csrf"
add_if_not_exists $SERVER_ENV_FILE "SENTRY_ORG" "xxx" "Server sentry organization"
add_if_not_exists $SERVER_ENV_FILE "SENTRY_PROJECT" "xxx" "Server sentry project"
add_if_not_exists $SERVER_ENV_FILE "SENTRY_AUTH_TOKEN" "xxx" "Server sentry auth token"

# ROOT
cd ..

npm install

# BACKEND

cd dev
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