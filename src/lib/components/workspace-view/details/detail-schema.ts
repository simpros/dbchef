import type { QueryResult } from 'pg';
import { z } from 'zod';

export const generateDetailSchema = (
	fields: QueryResult['fields']
	// types: Record<string, string>
) => {
	const schema = z.object({
		...Object.values(fields).reduce(
			(acc, key) => {
				// const type = types[key.name];
				const zType: z.ZodType = z.any();
				// if (type === 'text') {
				// 	zType = z.string();
				// }
				return {
					...acc,
					[key.name]: zType
				};
			},
			{} as Record<string, z.ZodType>
		)
	});
	return schema;
};

export type DetailSchema = ReturnType<typeof generateDetailSchema>;
