import type { Pool } from 'pg';

export async function getAvailableFieldsFromQuery(query: string, resource: Pool) {
	const queryBeforeWhere = query.split(/WHERE/i)[0];
	const limitedQuery = queryBeforeWhere + ' LIMIT 1';

	const result = await resource.query(limitedQuery);
	return result.fields;
}
