import type { Pool } from 'pg';
import type { Preview } from './preview-schema';

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

export async function callPreviewToDb(data: Preview, connection: Pool) {
	return await Promise.all(
		data.elements.map(async (element) => {
			try {
				const result = await connection.query(queryParser(element.providerQuery, data.parameters));
				return { name: element.name, type: element.type, result: result.rows };
			} catch (e) {
				if (e instanceof Error) {
					return { name: element.name, error: e.message };
				}
				return { name: element.name, error: 'Invalid Query' };
			}
		})
	);
}

export type PreviewData = Awaited<ReturnType<typeof callPreviewToDb>>;
