import { z } from 'zod';

export const availableElementTypes = ['select'] as const;

export const workspaceSchema = z.object({
	name: z.string().min(1),
	elements: z.array(
		z.object({
			name: z.string().min(1),
			type: z.enum(availableElementTypes),
			providerQuery: z.string().min(1)
		})
	)
});

export type WorkspaceSchema = typeof workspaceSchema;
