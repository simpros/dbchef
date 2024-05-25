import type { Pool } from 'pg';
import { mapFormToUpdateQueryValues } from './get-field-types';

// SELECT
export function replaceChefQueryPlaceholder(rawQuery: string, parameter: Record<string, unknown>) {
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

export async function parseUpdateChefQuery(
	chefQuery: string,
	parameter: Record<string, unknown>,
	values: Record<string, unknown>,
	dbConnection: Pool
) {
	if (!chefQuery.includes('{values}'))
		throw new Error('Update query must contain {values} parameter');

	const queryWithValues = chefQuery.replace(
		'{values}',
		await mapFormToUpdateQueryValues(chefQuery, values, dbConnection)
	);
	const finishedUpdateQuery = replaceChefQueryPlaceholder(queryWithValues, parameter);
	return finishedUpdateQuery;
}
