import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { genId } from '../../lib/generate-id';
import { workspaceTable } from './workspace';

export const workspaceViewTable = sqliteTable('workspace_view', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => genId('wsv')),
	name: text('name').notNull(),
	workspaceId: text('workspace_id')
		.notNull()
		.references(() => workspaceTable.id)
});

export type WorkspaceView = typeof workspaceViewTable.$inferSelect;

export const workspaceViewRelations = relations(workspaceViewTable, ({ one }) => ({
	workspace: one(workspaceTable, {
		fields: [workspaceViewTable.workspaceId],
		references: [workspaceTable.id]
	})
}));