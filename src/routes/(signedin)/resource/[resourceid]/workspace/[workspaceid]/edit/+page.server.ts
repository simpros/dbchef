import { workspaceElementTable, workspaceTable } from '$db/schema';
import {
	workspaceElementsSchema,
	workspaceSchema
} from '$lib/components/workspace-interactions/workspace-schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params: { workspaceid }, locals: { db } }) => {
	const currentVal = await db.query.workspaceTable.findFirst({
		where: ({ id }, { eq }) => eq(id, workspaceid),
		with: {
			elements: true,
			views: true
		}
	});

	if (!currentVal) error(404, 'Workspace not found');

	return {
		workspaceform: await superValidate(currentVal, zod(workspaceSchema)),
		elementsform: await superValidate(currentVal, zod(workspaceElementsSchema), {
			errors: false
		}),
		views: currentVal.views
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	'update-workspace': async ({ request, params: { workspaceid }, locals: { db } }) => {
		const form = await superValidate(request, zod(workspaceSchema));
		if (!form.valid) return { form };
		await db.update(workspaceTable).set(form.data).where(eq(workspaceTable.id, workspaceid));
		return message(form, { success: true, message: 'Workspace updated' });
	},
	'update-elements': async ({ request, params: { workspaceid }, locals: { db } }) => {
		const form = await superValidate(request, zod(workspaceElementsSchema));
		if (!form.valid) return { form };

		await db.transaction(async (tx) => {
			await Promise.all(
				form.data.elements.map(async (e) => {
					if (e.id !== undefined) {
						return tx
							.update(workspaceElementTable)
							.set({
								name: e.name,
								providerQuery: e.providerQuery,
								type: e.type
							})
							.where(eq(workspaceElementTable.id, e.id));
					} else {
						const [{ id: newId }] = await tx
							.insert(workspaceElementTable)
							.values({
								name: e.name,
								providerQuery: e.providerQuery,
								type: e.type,
								workspaceId: workspaceid
							})
							.returning({ id: workspaceElementTable.id });

						e.id = newId;
					}
				})
			);
		});

		return message(form, { success: true, message: 'Workspace updated' });
	}
};
