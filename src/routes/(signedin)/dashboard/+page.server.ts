import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { db } }) => {
	const resources = await db.query.resourceTable.findMany();
	if (!resources.length) {
		redirect(302, 'resource/add');
	}
	return { resources };
}) satisfies PageServerLoad;
