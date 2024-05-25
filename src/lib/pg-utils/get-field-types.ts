import type { Pool } from 'pg';

export type ChefFormType = 'text' | 'number' | 'date' | 'boolean' | 'UNKNOWN';
export type FieldTypes = Record<string, { data_type: ChefFormType; is_nullable: boolean }>;

function mapNativeDataTypeToFieldDataType(native_data_type: string): ChefFormType {
	switch (native_data_type) {
		case 'text':
			return 'text';
		case 'integer':
		case 'numeric':
		case 'real':
		case 'double precision':
			return 'number';
		case 'date':
		case 'timestamp':
		case 'time':
		case 'timestamp with time zone':
		case 'timestamp without time zone':
			return 'date';
		case 'boolean':
			return 'boolean';
		default:
			return 'UNKNOWN';
	}
}

async function getColumnTypes(table: string, dbConnection: Pool) {
	return dbConnection
		.query<{
			column_name: string;
			data_type: string;
			is_nullable: boolean;
		}>(
			'SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1',
			[table]
		)
		.then((result) => result.rows);
}

type ColumnType = Awaited<ReturnType<typeof getColumnTypes>>[number];

export async function getFieldTypesForForm(chefQuery: string, dbConnection: Pool) {
	const involvedTables = chefQuery.match(/(?<=FROM\s+)\w+/g);

	if (!involvedTables) {
		return null;
	}

	const columnTypes = await getColumnTypes(involvedTables[0], dbConnection);

	return columnTypes.reduce((acc, { column_name, data_type: native_data_type, is_nullable }) => {
		const data_type = mapNativeDataTypeToFieldDataType(native_data_type);
		acc[column_name] = { data_type, is_nullable };
		return acc;
	}, {} as FieldTypes);
}

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
