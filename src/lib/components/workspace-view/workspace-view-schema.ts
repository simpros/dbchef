import { availableViewTypes } from '$db/schema';
import { z } from 'zod';

export const workspaceViewSchema = z.object({
	name: z.string().min(1),
	description: z.string().nullable(),
	type: z.enum(availableViewTypes).default('card-grid'),
	providerQuery: z.string().min(1),
	detailQuery: z.string().nullable(),
	updateQuery: z.string().nullable(),
	relations: z.array(
		z.object({
			columnName: z.string().min(1),
			providerQuery: z.string().nullable()
		})
	)
});

export type WorkspaceViewSchema = typeof workspaceViewSchema;
