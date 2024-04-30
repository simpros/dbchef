import { generateDetailSchema } from '$lib/components/workspace-view/details/detail-schema';
import { getDetailData } from '$lib/components/workspace-view/details/get-detail-data';
import { getConnection } from '$lib/connections';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load = (async ({ params: { resourceid, viewid, item }, locals: { db } }) => {
	const view = await db.query.workspaceViewTable.findFirst({
		where: ({ id }, { eq }) => eq(id, viewid),
		with: {
			workspace: true
		}
	});

	if (!view) {
		error(404, 'View not found');
	}

	const connection = getConnection(resourceid);

	if (!connection) {
		return {};
	}

	const details = await getDetailData(view, { item }, connection).data;

	if (details.success === false) {
		error(400, details.error);
	}

	const schema = generateDetailSchema(details.rows.fields);

	const form = await superValidate(details.rows.rows[0], zod(schema));

	return { form };
}) satisfies PageServerLoad;
