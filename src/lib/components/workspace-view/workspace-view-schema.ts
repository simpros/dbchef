import { availableWorkspaceViewTypes } from '$db/schema';
import { z } from 'zod';

export const workspaceViewSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	type: z.enum(availableWorkspaceViewTypes).default('card-grid'),
	providerQuery: z.string().min(1)
});

export type WorkspaceViewSchema = typeof workspaceViewSchema;
