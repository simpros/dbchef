import { workspaceViewTable } from '$db/schema';
import { workspaceViewSchema } from '$lib/components/workspace-view/workspace-view-schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params: { resourceid, viewid }, locals: { db }, fetch }) => {
	const workspaceView = await db.query.workspaceViewTable.findFirst({
		where: ({ id }, { eq }) => eq(id, viewid)
	});

	if (!workspaceView) {
		return error(404, 'View not found.');
	}

	const viewData = await fetch('/api/get-view-data', {
		method: 'POST',
		body: JSON.stringify({ ...workspaceView, resource_id: resourceid })
	});

	const availableCardField = viewData.ok ? await viewData.json() : [];

	return { form: await superValidate(workspaceView, zod(workspaceViewSchema)), availableCardField };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params: { viewid }, locals: { db } }) => {
		const form = await superValidate(request, zod(workspaceViewSchema));

		if (!form.valid) return { form };

		try {
			await db.update(workspaceViewTable).set(form.data).where(eq(workspaceViewTable.id, viewid));
			return message(form, { success: true, message: 'View updated successfully.' });
		} catch (error) {
			return message(
				form,
				{ success: false, message: 'Failed to update view. Please try again.' },
				{
					status: 400
				}
			);
		}
	}
};
