export function parseChefQuery(rawQuery: string, parameter: Record<string, unknown>) {
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
