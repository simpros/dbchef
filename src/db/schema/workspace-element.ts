import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { genId } from '../../lib/generate-id';
import { workspaceTable } from './workspace';

export const workspaceElementTable = sqliteTable('workspace_element', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => genId('wse')),
	name: text('name').notNull(),
	type: text('type', { enum: ['select'] }).notNull(),
	providerQuery: text('provider_query').notNull(),
	workspaceId: text('workspace_id')
		.notNull()
		.references(() => workspaceTable.id)
});

export type WorkspaceElement = typeof workspaceElementTable.$inferSelect;

export const workspaceElementRelations = relations(workspaceElementTable, ({ one }) => ({
	workspace: one(workspaceTable, {
		fields: [workspaceElementTable.workspaceId],
		references: [workspaceTable.id]
	})
}));
