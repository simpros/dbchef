import { callPreviewToDb } from '$lib/components/workspace-preview/call-preview';
import { workspacePreviewSchema } from '$lib/components/workspace-preview/preview-schema';
import { error, json } from '@sveltejs/kit';
import { getConnection } from '../../(signedin)/resource/[resourceid]/connections';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { user } }) => {
	if (!user) return error(401, 'Unauthorized');
	const rawRequestData = await request.json();
	const form = workspacePreviewSchema.safeParse(rawRequestData);

	if (!form.success) return json(form.error, { status: 400 });

	// Execute the statements and return the result
	const connection = getConnection(form.data.resource_id);

	if (!connection) {
		return error(404, JSON.stringify({ error: 'No connection found for the given resource_id' }));
	}

	try {
		const results = await callPreviewToDb(form.data, connection);
		return json(results);
	} catch (e) {
		return error(500, 'Invalid Query');
	}
};
