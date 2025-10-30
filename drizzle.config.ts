import type { Config } from 'drizzle-kit';

export default {
  schema: './src/server/db/schema.ts',
  out: './src/server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '54320'),
    user: process.env.DATABASE_USER || 'plutor_user',
    password: process.env.DATABASE_PASSWORD || 'secure_password',
    database: process.env.DATABASE_NAME || 'plutor_db',
  },
} satisfies Config;