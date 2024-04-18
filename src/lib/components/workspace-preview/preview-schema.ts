import { z } from 'zod';

export const availableElementTypes = ['select'] as const;

export const workspacePreviewSchema = z.object({
	resource_id: z.string().min(1, 'Resource ID is required'),
	elements: z.array(
		z.object({
			name: z.string().min(1),
			type: z.enum(availableElementTypes),
			providerQuery: z.string()
		})
	),
	parameters: z.record(z.string())
});

export type PreviewSchema = typeof workspacePreviewSchema;
export type Preview = z.infer<PreviewSchema>;
