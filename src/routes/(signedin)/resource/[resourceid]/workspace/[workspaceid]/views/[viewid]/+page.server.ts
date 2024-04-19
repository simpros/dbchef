import { workspaceViewTable } from '$db/schema';
import { workspaceViewSchema } from '$lib/components/workspace-view/workspace-view-schema';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params: { viewid }, locals: { db } }) => {
	const workspaceView = await db.query.workspaceViewTable.findFirst({
		where: ({ id }, { eq }) => eq(id, viewid)
	});

	if (!workspaceView) {
		return error(404, 'View not found.');
	}

	return { form: await superValidate(workspaceView, zod(workspaceViewSchema)) };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params: { workspaceid }, locals: { db } }) => {
		const form = await superValidate(request, zod(workspaceViewSchema));

		if (!form.valid) return { form };

		try {
			await db.insert(workspaceViewTable).values({ ...form.data, workspaceId: workspaceid });
			return message(form, { success: true, message: 'View added successfully.' });
		} catch (error) {
			console.error(error);
			return message(
				form,
				{ success: false, message: 'Failed to add view. Please try again.' },
				{
					status: 400
				}
			);
		}
	}
};
