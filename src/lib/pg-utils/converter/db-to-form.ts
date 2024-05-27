import type { Pool } from 'pg';
import { getColumnTypes } from './common-converter';

export type ChefFormType = 'text' | 'number' | 'date' | 'boolean' | 'json' | 'UNKNOWN';
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
		case 'jsonb':
		case 'json':
			return 'json';
		default:
			return 'UNKNOWN';
	}
}

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
