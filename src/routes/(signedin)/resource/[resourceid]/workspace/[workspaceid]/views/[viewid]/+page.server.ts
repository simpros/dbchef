import { getViewData } from '$lib/components/workspace-view/get-view-data';
import { getConnection } from '$lib/connections';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({
	params: { resourceid, viewid },
	url: { searchParams },
	locals: { db }
}) => {
	const workspaceView = await db.query.workspaceViewTable.findFirst({
		where: ({ id }, { eq }) => eq(id, viewid)
	});

	if (!workspaceView) {
		return error(404, 'View not found.');
	}

	const resource = getConnection(resourceid);

	if (!resource) {
		return { viewData: null };
	}

	const viewData = getViewData(workspaceView, Object.fromEntries(searchParams), resource);
	return { viewData };
}) satisfies PageServerLoad;
