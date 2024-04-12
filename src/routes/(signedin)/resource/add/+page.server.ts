import { resourceTable } from '$db/schema/resource';
import type { Actions } from '@sveltejs/kit';
import { Client } from 'pg';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { addResourceSchema } from './schema';

export const load = (async () => {
	return { form: await superValidate(zod(addResourceSchema)) };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals: { db } }) => {
		const form = await superValidate(request, zod(addResourceSchema));

		if (!form.valid) {
			return form;
		}

		try {
			const client = new Client({
				host: form.data.host,
				port: form.data.port,
				user: form.data.user,
				database: form.data.database,
				password: form.data.password
			});
			await client.connect();
		} catch (e) {
			return setError(form, 'host', 'Could not connect to database');
		}

		try {
			await db.insert(resourceTable).values(form.data);
		} catch (e) {
			return setError(form, 'host', 'Could not insert into database');
		}

		return { form };
	}
};
