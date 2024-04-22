import type { WorkspaceElement, availableElementTypes } from '$db/schema';
import type { Pool } from 'pg';

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

export async function callElementQuery(
	element: WorkspaceElement,
	parameter: Record<string, unknown>,
	dbConnection: Pool
): Promise<ElementData> {
	try {
		const query = queryParser(element.providerQuery, parameter);
		const result = await dbConnection.query(query);
		return {
			success: true,
			name: element.name,
			type: element.type,
			options: result.rows
		};
	} catch (e) {
		if (e instanceof Error) {
			return { success: false, name: element.name, error: e.message } as const;
		}
		return { success: false, name: element.name, error: 'Invalid Query' } as const;
	}
}

export type SuccessElementData = {
	success: true;
	name: string;
	type: (typeof availableElementTypes)[number];
	options: Record<string, string>[];
};

export type ErrorElementData = {
	success: false;
	name: string;
	error: string;
};

export type ElementData = SuccessElementData | ErrorElementData;
