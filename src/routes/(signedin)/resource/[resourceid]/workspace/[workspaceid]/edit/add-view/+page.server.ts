import { workspaceViewTable } from '$db/schema';
import { workspaceViewSchema } from '$lib/components/workspace-view/workspace-view-schema';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return { form: await superValidate(zod(workspaceViewSchema)) };
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
