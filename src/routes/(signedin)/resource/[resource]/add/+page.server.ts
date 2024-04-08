import type { Actions } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { addWorkspaceSchema } from './add-view-schema';

export const load = (async ({ locals: { db } }) => {
	const resourceOptions = await db.query.resourceTable.findMany();
	return { form: await superValidate(zod(addWorkspaceSchema)), resourceOptions };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals: { db } }) => {
		const form = await superValidate(request, zod(addWorkspaceSchema));
		return { form };
	}
};
