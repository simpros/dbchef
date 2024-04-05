import { sessionTable, userTable } from '$db/schema/auth';
import { db } from '$lib/server/db';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
