import type { FieldTypes } from '$lib/pg-utils/get-field-types';
import type { QueryResult } from 'pg';
import { z } from 'zod';

function mapFieldTypesToZodType(fieldType: FieldTypes[keyof FieldTypes]) {
	switch (fieldType.data_type) {
		case 'text':
			return z.string();
		case 'number':
			return z.number();
		case 'date':
			return z.date();
		case 'UNKNOWN':
			return z.any();
	}
}

export const generateDetailSchema = (fields: QueryResult['fields'], types: FieldTypes) => {
	const schema = z.object({
		...Object.values(fields).reduce(
			(acc, key) => {
				return {
					...acc,
					[key.name]: mapFieldTypesToZodType(types[key.name])
				};
			},
			{} as Record<string, z.ZodType>
		)
	});
	return schema;
};

export type DetailSchema = ReturnType<typeof generateDetailSchema>;
