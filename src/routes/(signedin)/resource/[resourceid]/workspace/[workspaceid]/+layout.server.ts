import { getElementData } from '$lib/components/workspace-element/get-element-data';
import { getConnection } from '$lib/connections';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params: { workspaceid }, locals: { db }, url: { searchParams } }) => {
	const workspace = await db.query.workspaceTable.findFirst({
		where: ({ id }, { eq }) => eq(id, workspaceid),
		with: {
			elements: true,
			views: true
		}
	});

	if (!workspace) error(404, 'Workspace not found');

	const connection = getConnection(workspace.resourceId);
	if (!connection) {
		return { workspace };
	}

	const elements = getElementData(workspace.elements, Object.fromEntries(searchParams), connection);

	return { workspace, elements };
}) satisfies LayoutServerLoad;
