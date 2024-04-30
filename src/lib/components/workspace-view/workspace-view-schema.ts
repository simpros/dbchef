import { availableViewTypes } from '$db/schema';
import { z } from 'zod';

export const workspaceViewSchema = z.object({
	name: z.string().min(1),
	description: z.string().nullable(),
	type: z.enum(availableViewTypes).default('card-grid'),
	providerQuery: z.string().min(1),
	card: z.string().array().default([])
});

export type WorkspaceViewSchema = typeof workspaceViewSchema;
