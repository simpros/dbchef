import { error, json } from '@sveltejs/kit';
import { getConnection } from '../../(signedin)/resource/[resourceid]/connections';
import type { RequestHandler } from './$types';
import { workspacePreviewSchema } from './workspace-preview-schema';

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
		const results = await Promise.all(
			form.data.elements.map(async (element) => {
				try {
					const result = await connection.query(element.providerQuery);
					return { name: element.name, result: result.rows };
				} catch (e) {
					return { name: element.name, error: 'Invalid Query' };
				}
			})
		);
		return json(results);
	} catch (e) {
		return error(500, 'Invalid Query');
	}
};
