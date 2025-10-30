import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DATABASE_USER || 'plutor_user'}:${process.env.DATABASE_PASSWORD || 'secure_password'}@${process.env.DATABASE_HOST || 'localhost'}:${process.env.DATABASE_PORT || '54320'}/${process.env.DATABASE_NAME || 'plutor_db'}`;

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

export { schema };

export async function testConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeConnection(): Promise<void> {
  await client.end();
}