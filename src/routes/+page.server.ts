import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { db } }) => {
	const { length } = await db.query.resourceTable.findMany();
	if (length === 0) {
		redirect(307, '/add-resource');
	} else {
		redirect(307, '/dashboard');
	}
}) satisfies PageServerLoad;
