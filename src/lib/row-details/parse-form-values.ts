import type { FieldTypes } from '$lib/pg-utils/converter/db-to-form';

export function parseFormValuesFromRow(row: Record<string, any>, types: FieldTypes) {
	return Object.entries(row).reduce(
		(acc, [key, value]) => {
			const type = types[key];
			if (!type) {
				throw new Error(`Type not found for field ${key}`);
			}
			switch (type.data_type) {
				case 'json':
					acc[key] = JSON.stringify(value, null, 2);
					break;
				default:
					acc[key] = value;
			}
			return acc;
		},
		{} as Record<string, any>
	);
}
