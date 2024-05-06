import type { Pool } from 'pg';

export type FieldDataTypes = 'text' | 'number' | 'date' | 'boolean' | 'UNKNOWN';
export type FieldTypes = Record<string, { data_type: FieldDataTypes; is_nullable: boolean }>;

function mapNativeDataTypeToFieldDataType(native_data_type: string): FieldDataTypes {
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
			return 'date';
		case 'boolean':
			return 'boolean';
		default:
			return 'UNKNOWN';
	}
}

export async function getFieldTypesFromQuery(rawQuery: string, dbConnection: Pool) {
	const involvedTables = rawQuery.match(/(?<=FROM\s+)\w+/g);

	if (!involvedTables) {
		return null;
	}
	const fieldTypesDBResult = await dbConnection.query<{
		column_name: string;
		data_type: string;
		is_nullable: boolean;
	}>(
		`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1`,
		[involvedTables[0]]
	);

	return fieldTypesDBResult.rows.reduce(
		(acc, { column_name, data_type: native_data_type, is_nullable }) => {
			const data_type = mapNativeDataTypeToFieldDataType(native_data_type);
			acc[column_name] = { data_type, is_nullable };
			return acc;
		},
		{} as FieldTypes
	);
}
