import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params: { workspaceid }, parent }) => {
	const { workspace } = await parent();
	const firstViewElement = workspace.views.at(0);

	if (firstViewElement) {
		redirect(
			307,
			`/resource/${workspace.resourceId}/workspace/${workspaceid}/views/${firstViewElement.id}`
		);
	}
}) satisfies PageServerLoad;
