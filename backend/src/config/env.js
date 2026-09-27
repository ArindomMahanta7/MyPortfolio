import 'dotenv/config';

const required = ['NODE_ENV', 'PORT', 'DATABASE_URL', 'JWT_SECRET', /* ... */];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing env vars: ${missing.join(', ')}`);
}

const port = Number(process.env.PORT);
if (Number.isNaN(port)) throw new Error('PORT must be a number');

if ((process.env.JWT_SECRET || '').length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}

export default Object.freeze({
  nodeEnv: process.env.NODE_ENV,
  port,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  // ...
});