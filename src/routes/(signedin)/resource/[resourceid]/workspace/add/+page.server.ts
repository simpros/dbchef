import { resourceViewTable } from '$db/schema';
import type { Actions } from '@sveltejs/kit';
import { count, eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import { workspaceSchema } from '$lib/components/workspace-interactions/workspace-schema';
import type { PageServerLoad } from './$types';

export const load = (async ({ params: { resourceid }, locals: { db }, parent }) => {
	const [{ resource }, [{ count: numberOfViews }]] = await Promise.all([
		parent(),
		db
			.select({
				count: count()
			})
			.from(resourceViewTable)
			.where(eq(resourceViewTable.resourceId, resourceid))
			.limit(1)
	]);
	return {
		form: await superValidate(
			{
				name: `${resource.name} Workspace #${numberOfViews + 1}`,
				elements: [{ name: '', type: 'select', providerQuery: '' }]
			},
			zod(workspaceSchema),
			{
				errors: false
			}
		)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals: { db } }) => {
		const form = await superValidate(request, zod(workspaceSchema));
		return { form };
	}
};
