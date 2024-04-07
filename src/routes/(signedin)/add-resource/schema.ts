import { z } from 'zod';

export const addResourceSchema = z.object({
	host: z.string().default('localhost'),
	port: z.coerce.number().int().positive().default(5432),
	database: z.string().min(1),
	user: z.string().min(1),
	password: z.string().min(1)
});

export type AddResourceSchema = typeof addResourceSchema;
