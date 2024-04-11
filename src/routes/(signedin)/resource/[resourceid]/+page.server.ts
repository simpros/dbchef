import { error, redirect } from '@sveltejs/kit';
import { Pool } from 'pg';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { addConnection, removeConnection } from './connections';
import { establishConnectionSchema } from './establish-connection-schema';

export const load = (async ({ params: { resourceid }, locals: { db } }) => {
	return {
		resource: await db.query.resourceTable.findFirst({
			where: ({ id }, { eq }) => eq(id, resourceid)
		}),
		views: await db.query.resourceViewTable.findMany({
			where: ({ resourceId }, { eq }) => eq(resourceId, resourceid)
		})
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	connect: async ({ request, params: { resourceid }, locals: { db }, url }) => {
		const form = await superValidate(request, zod(establishConnectionSchema));
		if (!form.valid) {
			return form;
		}
		const resource = await db.query.resourceTable.findFirst({
			where: ({ id }, { eq }) => eq(id, resourceid)
		});

		if (!resource) {
			error(404, `Resource "${resourceid}" not found`);
		}

		const connection = new Pool({
			host: resource.host,
			port: resource.port,
			user: resource.user,
			password: form.data.password,
			database: resource.database
		});

		try {
			const client = await connection.connect();
			addConnection(resourceid, client);
		} catch (e) {
			return setError(form, 'password', 'Invalid password');
		}

		redirect(302, url.pathname);
	},
	disconnect: async ({ params: { resourceid }, url }) => {
		removeConnection(resourceid);
		redirect(302, url.pathname);
	}
};
