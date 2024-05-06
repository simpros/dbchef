import type { WorkspaceView, availableViewTypes } from '$db/schema';
import type { Pool, QueryResult } from 'pg';

function queryParser(rawQuery: string, parameter: Record<string, unknown>) {
	//replace all {X} params in the rawQuery with the corresponding value from parameter
	const newQuery = rawQuery.replace(/{(\w+)}/g, (substring) => {
		const key = substring.slice(1, -1);
		const value = parameter[key];

		if (value === undefined) throw new Error(`Parameter ${key} is missing`);

		if (typeof value === 'number') return value + '';
		if (typeof value === 'boolean') return value + '';
		return `'${parameter[key]}'`;
	});
	return newQuery;
}

export async function callDetailQuery(
	view: WorkspaceView,
	parameter: Record<string, unknown>,
	dbConnection: Pool
): Promise<DetailData> {
	try {
		if (!view.detailQuery) throw new Error('No detail query');
		const query = queryParser(view.detailQuery, parameter);
		const result = await dbConnection.query(query);

		if (result.rows.length === 0) throw new Error('No data found');
		if (result.rows.length > 1) throw new Error('Multiple rows found');

		return {
			success: true,
			name: view.name,
			type: view.type,
			rows: result
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
	rows: QueryResult;
};

export type ErrorViewData = {
	success: false;
	name: string;
	error: string;
};

export type DetailData = SuccessViewData | ErrorViewData;
