import { resourceViewTable } from '$db/schema';
import type { Actions } from '@sveltejs/kit';
import { count, eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { addWorkspaceSchema } from './add-workspace-schema';

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
			{ name: `${resource.name} Workspace #${numberOfViews + 1}` },
			zod(addWorkspaceSchema)
		)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals: { db } }) => {
		const form = await superValidate(request, zod(addWorkspaceSchema));
		return { form };
	}
};
