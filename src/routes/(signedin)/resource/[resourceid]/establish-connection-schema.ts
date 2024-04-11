import { z } from 'zod';

export const establishConnectionSchema = z.object({
	password: z.string().min(1)
});

export type EstablishConnectionSchema = typeof establishConnectionSchema;
