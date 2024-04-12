import { z } from 'zod';

export const availableElementTypes = ['select'] as const;

export const addWorkspaceSchema = z.object({
	name: z.string().min(1),
	elements: z
		.array(
			z.object({
				type: z.enum(availableElementTypes),
				providerQuery: z.string().min(1)
			})
		)
		.default([{ type: 'select', providerQuery: '' }])
});

export type AddWorkspaceSchema = typeof addWorkspaceSchema;
