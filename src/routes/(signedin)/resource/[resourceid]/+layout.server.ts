import { getConnection } from '$lib/connections';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { LayoutServerLoad } from './$types';
import { establishConnectionSchema } from './establish-connection-schema';

export const load = (async ({ params: { resourceid }, locals: { db }, depends }) => {
	depends(resourceid);
	const resource = await db.query.resourceTable.findFirst({
		where: ({ id }, { eq }) => eq(id, resourceid)
	});

	if (!resource) {
		error(404, `Resource "${resourceid}" not found`);
	}

	const pool = getConnection(resourceid) !== undefined;

	if (!pool) {
		return {
			resource,
			pool,
			establishConnectionForm: await superValidate(zod(establishConnectionSchema))
		};
	}

	return { resource, pool };
}) satisfies LayoutServerLoad;
