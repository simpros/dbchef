import { randomUUID } from 'crypto';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const resourceTable = sqliteTable('resource', {
	id: text('id')
		.primaryKey()
		.$default(() => randomUUID()),
	name: text('name').notNull(),
	host: text('host').notNull(),
	port: integer('port').notNull(),
	user: text('user').notNull(),
	database: text('database').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`)
});

export type Resource = typeof resourceTable.$inferSelect;
