export function getFieldTypesFromQuery(rawQuery: string, dbConnection: Pool) {
	const involvedTables = rawQuery.match(/(?<=from )\w+/g);
	if (!involvedTables) {
		return {};
	}
	console.log('involvedTables:', involvedTables);
}
