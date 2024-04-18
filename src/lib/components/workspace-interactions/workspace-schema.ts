import { z } from 'zod';

export const availableElementTypes = ['select'] as const;

const workspaceElementSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	type: z.enum(availableElementTypes),
	providerQuery: z.string().min(1)
});

export const workspaceElementsSchema = z.object({
	elements: workspaceElementSchema.array()
});

export type WorkspaceElementsSchema = typeof workspaceElementsSchema;

export const workspaceSchema = z.object({
	name: z.string().min(1)
});

export type WorkspaceSchema = typeof workspaceSchema;
