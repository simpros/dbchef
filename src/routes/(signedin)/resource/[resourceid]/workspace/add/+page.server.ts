import { workspaceTable } from '$db/schema';
import { count, eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms/server';

import { workspaceSchema } from '$lib/components/workspace-interactions/workspace-schema';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params: { resourceid }, locals: { db }, parent }) => {
	const [{ resource }, [{ count: numberOfViews }]] = await Promise.all([
		parent(),
		db
			.select({
				count: count()
			})
			.from(workspaceTable)
			.where(eq(workspaceTable.resourceId, resourceid))
			.limit(1)
	]);
	return {
		form: await superValidate(
			{
				name: `${resource.name} Workspace #${numberOfViews + 1}`
			},
			zod(workspaceSchema),
			{
				errors: false
			}
		)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params: { resourceid }, locals: { db } }) => {
		const form = await superValidate(request, zod(workspaceSchema));

		if (!form.valid) return { form };

		const newWorkspace = await db.transaction(async (tx) => {
			const [{ id }] = await tx
				.insert(workspaceTable)
				.values({
					name: form.data.name,
					resourceId: resourceid
				})
				.returning({ id: workspaceTable.id });

			return id;
		});

		return message(form, {
			success: true,
			message: 'Workspace updated',
			redirect: `${newWorkspace}/edit`
		});
	}
};
