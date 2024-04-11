import { randomUUID } from 'crypto';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { resourceTable } from './resource';

export const resourceViewTable = sqliteTable('resource_view', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	name: text('name').notNull(),
	resourceId: text('resource_id')
		.notNull()
		.references(() => resourceTable.id)
});
