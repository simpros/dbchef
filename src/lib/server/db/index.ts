import { env } from '$env/dynamic/private';
import Database from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = new Database(env.DATABASE_URL);

// Enable foreign key constraints
client.run('PRAGMA foreign_keys = ON;');

// Performance optimizations
client.run('PRAGMA journal_mode = WAL;'); // Write-Ahead Logging for better concurrency
client.run('PRAGMA synchronous = NORMAL;'); // Balance between safety and performance
client.run('PRAGMA cache_size = 1000000;'); // 1GB cache (1000000 * 1KB pages)
client.run('PRAGMA temp_store = MEMORY;'); // Store temporary tables in memory

// Security and integrity
client.run('PRAGMA secure_delete = ON;'); // Overwrite deleted data
client.run('PRAGMA auto_vacuum = INCREMENTAL;'); // Reclaim space incrementally

export const db = drizzle(client, { schema, casing: 'snake_case' });
