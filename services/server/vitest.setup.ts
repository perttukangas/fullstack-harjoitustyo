const defaults: Record<string, string> = {
  NODE_ENV: 'test',
  PORT: '3000',
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/test',
  LOG_LEVEL: 'INFO',
  AUTH_SECRET: 'test-auth-secret',
  CLIENT_URL: 'http://localhost:5173',
  COOKIE_SECRET: 'test-cookie-secret',
  CSRF_SECRET: 'test-csrf-secret',
  SENTRY_AUTH_TOKEN: 'test-sentry-token',
};

for (const [key, value] of Object.entries(defaults)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}
