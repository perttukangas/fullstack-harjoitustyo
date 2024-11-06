import { cleanEnv, port, str, url } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  PORT: port(),
  DATABASE_URL: url(),
  LOG_LEVEL: str({ choices: ['DEBUG', 'INFO', 'ERROR'], default: 'INFO' }),
  AUTH_SECRET: str(),
  CLIENT_URL: url(),
});

export const {
  NODE_ENV,
  PORT,
  DATABASE_URL,
  LOG_LEVEL,
  AUTH_SECRET,
  CLIENT_URL,
} = env;
