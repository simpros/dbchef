import { randomUUID } from 'crypto';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { resourceViewTable } from './resource-view';

export const viewElement = sqliteTable('view_element', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	type: text('type', { enum: ['select'] }).notNull(),
	providerQuery: text('provider_query').notNull(),
	viewId: text('view_id')
		.notNull()
		.references(() => resourceViewTable.id)
});
