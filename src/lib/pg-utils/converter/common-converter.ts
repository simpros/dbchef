import type { Pool } from 'pg';

export async function getColumnTypes(tablename: string, dbConnection: Pool) {
	return dbConnection
		.query<{
			column_name: string;
			data_type: string;
			is_nullable: boolean;
		}>(
			'SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1',
			[tablename]
		)
		.then((result) => result.rows);
}

export type ColumnType = Awaited<ReturnType<typeof getColumnTypes>>[number];
