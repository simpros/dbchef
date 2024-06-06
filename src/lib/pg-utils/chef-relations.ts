import type { Pool } from 'pg';

async function getRelations(tableName: string, dbConnection: Pool) {
	const res = await dbConnection.query<{
		column_name: string;
		target_table: string;
		target_column: string;
	}>(
		`SELECT
	kcu.column_name as column_name,
	ccu.table_name as target_table,
	ccu.column_name as target_column
FROM
	information_schema.table_constraints tc
	JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
	JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE
	tc.constraint_schema = 'public'
	AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
	AND tc.table_name = $1`,
		[tableName]
	);

	return res.rows;
}

export async function getRelationsOfQuery(chefQuery: string, dbConnection: Pool) {
	const involvedTables = chefQuery.match(/(?<=FROM\s+)\w+/g);

	if (!involvedTables) {
		return null;
	}

	const relations = await getRelations(involvedTables[0], dbConnection);
	return relations;
}

export type ChefRelations = Awaited<ReturnType<typeof getRelationsOfQuery>>;
