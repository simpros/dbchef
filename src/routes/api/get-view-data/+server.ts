import { getAvailableFieldsFromQuery } from '$lib/components/common/getAvailableFieldsFromQuery';
import { workspaceViewSchema } from '$lib/components/workspace-view/workspace-view-schema';
import { getConnection } from '$lib/connections';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

const requestSchema = workspaceViewSchema.extend({
	resource_id: z.string().min(1)
});

export const POST: RequestHandler = async ({ request, locals: { user } }) => {
	if (!user) return error(401, 'Unauthorized');
	const rawRequestData = await request.json();
	const form = requestSchema.safeParse(rawRequestData);

	if (!form.success) {
		return json(form.error, { status: 400 });
	}

	// Execute the statements and return the result
	const connection = getConnection(form.data.resource_id);

	if (!connection) {
		return error(404, JSON.stringify({ error: 'No connection found for the given resource_id' }));
	}

	try {
		const results = await getAvailableFieldsFromQuery(form.data.providerQuery, connection);
		return json(results);
	} catch (e) {
		return error(400, 'Invalid Query');
	}
};
