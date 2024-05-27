import type { Pool } from 'pg';
import { mapFormToUpdateQueryValues } from './converter/form-to-db';

/**
 * Takes a stored query with parameters and replaces the parameters with the values from the parameter object
 * @param chefQuery The query that should be sent to the resource
 * @param parameter The parameters that should be used in the query
 * @returns The chefquery with the parameters replaced
 */
export function parseSelectChefQuery(chefQuery: string, parameter: Record<string, unknown>) {
	//replace all {X} params in the rawQuery with the corresponding value from parameter
	const newQuery = chefQuery.replace(/{(\w+)}/g, (substring) => {
		const key = substring.slice(1, -1);
		const value = parameter[key];

		if (value === undefined) throw new Error(`Parameter ${key} is missing`);

		if (typeof value === 'number') return value + '';
		if (typeof value === 'boolean') return value + '';
		return `'${parameter[key]}'`;
	});
	return newQuery;
}

/**
 *
 * @param chefQuery The query that should be sent to the resource with {values} as a placeholder for the values and optional parameters
 * @param parameter The parameters that should be used in the query
 * @param values The values that should be used in the query
 * @param dbConnection Thew connection to the database - Required for getting the field types of the values
 * @returns
 */
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
	const finishedUpdateQuery = parseSelectChefQuery(queryWithValues, parameter);
	return finishedUpdateQuery;
}
