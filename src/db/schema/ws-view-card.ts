import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { genId } from '../../lib/generate-id';
import { workspaceViewTable } from './ws-view';

export const wsViewCardTable = sqliteTable('ws_view_card', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => genId('wsvc')),
	name: text('name').notNull(),
	fields: text('fields', { mode: 'json' }).notNull().$type<string[]>(),
	viewId: text('view_id')
		.notNull()
		.references(() => workspaceViewTable.id)
});

export type WSViewCard = typeof wsViewCardTable.$inferSelect;

export const wsViewCardRelations = relations(wsViewCardTable, ({ one }) => ({
	view: one(workspaceViewTable)
}));
