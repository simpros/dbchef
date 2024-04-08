import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { db } }) => {
	return { resources: await db.query.resourceTable.findMany() };
}) satisfies PageServerLoad;
