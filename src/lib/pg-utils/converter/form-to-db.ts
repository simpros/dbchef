import type { Pool } from 'pg';
import { getColumnTypes, type ColumnType } from './common-converter';

function mapValueToColumn(value: unknown, fieldDataType: ColumnType): string | null {
	if (typeof value === 'string') {
		return `'${value}'`;
	}

	if (typeof value === 'number') {
		return `${value}`;
	}

	if (typeof value === 'boolean') {
		return `${value}`;
	}

	if (value instanceof Date) {
		return value instanceof Date ? `'${value.toISOString()}'` : null;
	}

	return null;
}

function mapFormDataToRow(values: Record<string, unknown>, fieldDataType: ColumnType[]) {
	return Object.entries(values).reduce(
		(acc, [key, value]) => {
			const columnType = fieldDataType.find((column) => column.column_name === key);
			if (!columnType) {
				return acc;
			}
			const mappedValue = mapValueToColumn(value, columnType);

			if (mappedValue === null) {
				return acc;
			}
			acc[key] = mappedValue;
			return acc;
		},
		{} as Record<string, string>
	);
}

export async function mapFormToUpdateQueryValues(
	chefQuery: string,
	values: Record<string, unknown>,
	dbConnection: Pool
) {
	const involvedTable = chefQuery.match(/(?<=UPDATE\s+)\w+/g);

	if (!involvedTable) {
		throw new Error('Could not determine table from query');
	}

	const columnTypes = await getColumnTypes(involvedTable[0], dbConnection);
	const valueObject = mapFormDataToRow(values, columnTypes);
	return Object.entries(valueObject)
		.reduce((acc, [key, value]) => `${acc}${key} = ${value}, `, '')
		.slice(0, -2);
}
