import type { FieldTypes } from '$lib/pg-utils/converter/db-to-form';
import type { QueryResult } from 'pg';
import { z } from 'zod';

function mapFieldTypesToZodType(fieldType: FieldTypes[keyof FieldTypes]) {
	let type: z.ZodType = z.any();
	switch (fieldType.data_type) {
		case 'text':
			type = z.string();
			break;
		case 'number':
			type = z.number();
			break;
		case 'date':
			type = z.date();
			break;
		case 'boolean':
			type = z.boolean();
			break;
	}
	if (fieldType.is_nullable) {
		type = type.nullable();
	}
	return type;
}

export const generateDetailSchema = (fields: QueryResult['fields'], types: FieldTypes) => {
	const schema = z.object({
		...Object.values(fields).reduce((acc, key) => {
			return {
				...acc,
				[key.name]: mapFieldTypesToZodType(types[key.name])
			};
		}, {} as z.ZodRawShape)
	});
	return schema;
};

export type DetailSchema = ReturnType<typeof generateDetailSchema>;
