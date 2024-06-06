import { relations } from 'drizzle-orm';
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { workspaceViewTable } from './ws-view';

export const wsViewRelationTable = sqliteTable(
	'workspace_view_relation',
	{
		viewId: text('view_id')
			.notNull()
			.references(() => workspaceViewTable.id),
		columnName: text('column_name').notNull(),
		providerQuery: text('provider_query').notNull()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.viewId, table.columnName] })
		};
	}
);

export const wsViewRelationRelations = relations(wsViewRelationTable, ({ one }) => ({
	view: one(workspaceViewTable, {
		fields: [wsViewRelationTable.viewId],
		references: [workspaceViewTable.id]
	})
}));
