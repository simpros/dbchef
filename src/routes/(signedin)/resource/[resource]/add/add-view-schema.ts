import { z } from 'zod';

export const addWorkspaceSchema = z.object({
	name: z.string().min(3),
	resourceId: z.string().uuid()
});

export type AddWorkspaceSchema = typeof addWorkspaceSchema;
