/**
 * Central export point for all server-side functionality
 */

// Database
export { db, testConnection, closeConnection } from './db';
export * from './db/schema';
export * from './db/queries';

// Utilities
export * from './lib/did';