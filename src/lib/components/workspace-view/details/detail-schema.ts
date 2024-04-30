import type { QueryResult } from 'pg';
import { z } from 'zod';

export const generateDetailSchema = (fields: QueryResult['fields']) => {
	const schema = z.object({
		...Object.values(fields).reduce((acc, key) => {
			const type = key.format;
			console.log(type);

			return {
				...acc,
				[key.name]: z.any()
			};
		}, {})
	});
	return schema;
};
