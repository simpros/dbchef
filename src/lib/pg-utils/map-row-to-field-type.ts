import { fromDate } from '@internationalized/date';
import type { QueryResult } from 'pg';
import type { FieldTypes } from './get-field-types';

export function mapRowToFieldType(row: QueryResult['rows'][number], types: FieldTypes) {
	const mappedTypes = Object.entries(row).reduce(
		(acc, [key, value]) => {
			const type = types[key];
			if (type.data_type === 'number') {
				acc[key] = Number(value);
			} else if (type.data_type === 'boolean') {
				acc[key] = value === 'true';
			} else if (type.data_type === 'date') {
				acc[key] = value instanceof Date ? fromDate(value, 'utc') : null;
			} else {
				acc[key] = value;
			}
			return acc;
		},
		{} as Record<string, unknown>
	);
	return mappedTypes;
}
