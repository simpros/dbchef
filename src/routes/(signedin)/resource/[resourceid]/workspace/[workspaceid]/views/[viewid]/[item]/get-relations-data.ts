import type { WorkspaceViewRelation } from '$db/schema';
import { parseSelectChefQuery } from '$lib/pg-utils/parse-chef-query';
import type { Pool } from 'pg';

export async function callRelationQuery(
	chefQuery: string,
	parameter: Record<string, unknown>,
	dbConnection: Pool
) {
	try {
		const query = parseSelectChefQuery(chefQuery, parameter);
		const result = await dbConnection.query<{ label: string; value: string }>(query);

		return result.rows;
	} catch (e) {
		if (e instanceof Error) {
			throw { error: e.message } as const;
		}
		throw { error: 'Invalid Query' } as const;
	}
}

type GetRelationDataProps = {
	relations: WorkspaceViewRelation[];
	parameters: Record<string, unknown>;
	connection: Pool;
};

export async function getRelationsData({
	connection,
	parameters,
	relations
}: GetRelationDataProps) {
	const data = relations.reduce(
		(acc, relation) => {
			const result = callRelationQuery(relation.providerQuery, parameters, connection);
			acc[relation.columnName] = result;
			return acc;
		},
		{} as { [key: string]: ReturnType<typeof callRelationQuery> }
	);
	return data;
}

export type RelationsData = Awaited<ReturnType<typeof getRelationsData>>;
