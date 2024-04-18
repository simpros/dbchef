import {
	callElement,
	type ElementData
} from '$lib/components/workspace-element/get-workspace-element';
import { error } from '@sveltejs/kit';
import { getConnection } from '../../connections';
import type { PageServerLoad } from './$types';

export const load = (async ({ params: { workspaceid }, locals: { db }, url: { searchParams } }) => {
	const workspace = await db.query.workspaceTable.findFirst({
		where: ({ id }, { eq }) => eq(id, workspaceid),
		with: {
			elements: true
		}
	});

	if (!workspace) error(404, 'Workspace not found');

	const connection = getConnection(workspace.resourceId);
	if (!connection) {
		return { workspace };
	}

	const elements = workspace.elements.reduce(
		(acc, element) => {
			const elementData = callElement(element, Object.fromEntries(searchParams), db, connection);
			acc[element.id] = elementData;

			return acc;
		},
		{} as Record<string, Promise<ElementData>>
	);

	return { workspace: workspace, elements };
}) satisfies PageServerLoad;
