import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { genId } from '../../lib/generate-id';
import { resourceTable } from './resource';
import { workspaceElementTable } from './ws-element';
import { workspaceViewTable } from './ws-view';

export const workspaceTable = sqliteTable('workspace', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => genId('ws')),
	name: text('name').notNull(),
	resourceId: text('resource_id')
		.notNull()
		.references(() => resourceTable.id)
});

export const workspaceRelations = relations(workspaceTable, ({ many }) => ({
	elements: many(workspaceElementTable),
	views: many(workspaceViewTable)
}));
