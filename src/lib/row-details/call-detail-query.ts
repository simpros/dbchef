import type { WorkspaceView, availableViewTypes } from '$db/schema';
import { parseSelectChefQuery } from '$lib/pg-utils/parse-chef-query';
import type { Pool, QueryResult } from 'pg';

export async function callDetailQuery(
	view: WorkspaceView,
	parameter: Record<string, unknown>,
	dbConnection: Pool
): Promise<DetailData> {
	try {
		if (!view.detailQuery) throw new Error('No detail query');
		const query = parseSelectChefQuery(view.detailQuery, parameter);
		const result = await dbConnection.query(query);

		if (result.rows.length === 0) throw new Error('No data found');
		if (result.rows.length > 1) throw new Error('Multiple rows found');

		return {
			success: true,
			name: view.name,
			type: view.type,
			result
		};
	} catch (e) {
		if (e instanceof Error) {
			return { success: false, name: view.name, error: e.message } as const;
		}
		return { success: false, name: view.name, error: 'Invalid Query' } as const;
	}
}

export type SuccessViewData = {
	success: true;
	name: string;
	type: (typeof availableViewTypes)[number];
	result: QueryResult;
};

export type ErrorViewData = {
	success: false;
	name: string;
	error: string;
};

export type DetailData = SuccessViewData | ErrorViewData;
