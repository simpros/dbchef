import type { WorkspaceView } from '$db/schema';
import { parseSelectChefQuery } from '$lib/pg-utils/parse-chef-query';
import type { Pool, QueryResult } from 'pg';

export async function callDetailQuery(
	chefQuery: string,
	parameter: Record<string, unknown>,
	dbConnection: Pool
): Promise<DetailData> {
	try {
		const query = parseSelectChefQuery(chefQuery, parameter);
		const result = await dbConnection.query(query);

		if (result.rows.length === 0) throw new Error('No data found');
		if (result.rows.length > 1) throw new Error('Multiple rows found');

		return {
			success: true,
			result
		};
	} catch (e) {
		if (e instanceof Error) {
			return { success: false, error: e.message } as const;
		}
		return { success: false, error: 'Invalid Query' } as const;
	}
}

type SuccessViewData = {
	success: true;
	result: QueryResult;
};

type ErrorViewData = {
	success: false;
	error: string;
};

type DetailData = SuccessViewData | ErrorViewData;

export function getDetailData(
	element: WorkspaceView,
	parameters: Record<string, unknown>,
	connection: Pool
) {
	if (!element.detailQuery) throw new Error('No detail query');

	const data = callDetailQuery(element.detailQuery, parameters, connection);
	return data;
}
