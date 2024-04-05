import * as schema from '$db/schema';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

const sqliteDb = new Database('dbchef.sqlite');
export const db = drizzle(sqliteDb, { schema });
