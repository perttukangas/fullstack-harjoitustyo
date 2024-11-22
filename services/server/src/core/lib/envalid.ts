import { cleanEnv, port, str, url } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  PORT: port(),
  DATABASE_URL: url(),
  LOG_LEVEL: str({ choices: ['DEBUG', 'INFO', 'ERROR'], default: 'INFO' }),
  AUTH_SECRET: str(),
  CLIENT_URL: url(),
  COOKIE_SECRET: str(),
  CSRF_SECRET: str(),
  SENTRY_AUTH_TOKEN: str(),
  VERSION: str(),
});

export const isDev = env.isDev;

export const {
  NODE_ENV,
  PORT,
  DATABASE_URL,
  LOG_LEVEL,
  AUTH_SECRET,
  CLIENT_URL,
  COOKIE_SECRET,
  CSRF_SECRET,
  VERSION,
} = env;
