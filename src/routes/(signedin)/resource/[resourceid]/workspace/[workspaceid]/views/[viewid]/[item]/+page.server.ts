import { getConnection } from '$lib/connections';
import { getFieldTypesForForm } from '$lib/pg-utils/get-field-types';
import { parseUpdateChefQuery } from '$lib/pg-utils/parse-chef-query';
import { generateDetailSchema } from '$lib/row-details/detail-schema';
import { getDetailData } from '$lib/row-details/get-detail-data';
import { error, fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

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

	if (!view.detailQuery) {
		error(400, 'No detail query');
	}

	const [details, types] = await Promise.all([
		getDetailData(view, { item }, connection).data,
		getFieldTypesForForm(view.detailQuery, connection)
	]);

	if (details.success === false) {
		error(400, details.error);
	}
	if (types === null) {
		error(400, 'Could not determine field types of detailQuery');
	}

	const row = details.result.rows[0];

	const schema = generateDetailSchema(details.result.fields, types);

	const form = await superValidate(row, zod(schema), {
		id: 'detail'
	});

	return { form, types, readonly: !view.updatedQuery };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals: { db }, params: { viewid, resourceid, item }, url }) => {
		const view = await db.query.workspaceViewTable.findFirst({
			where: ({ id }, { eq }) => eq(id, viewid),
			with: {
				workspace: true
			}
		});

		if (!view) {
			return fail(404, { error: 'View not found' });
		}

		const connection = getConnection(resourceid);

		if (!connection) {
			return fail(400, { error: 'Connection not found' });
		}

		if (!view.detailQuery || !view.updatedQuery) {
			return fail(400, { error: 'No detail query' });
		}

		const [details, types] = await Promise.all([
			getDetailData(view, { item }, connection).data,
			getFieldTypesForForm(view.detailQuery, connection)
		]);

		if (details.success === false) {
			error(400, details.error);
		}
		if (types === null) {
			error(400, 'Could not determine field types of detailQuery');
		}

		const schema = generateDetailSchema(details.result.fields, types);

		const form = await superValidate(request, zod(schema), {
			id: 'detail'
		});

		if (!form.valid) {
			return { form };
		}

		const updateQuery = await parseUpdateChefQuery(
			view.updatedQuery,
			{ item, ...Object.fromEntries(url.searchParams) },
			form.data,
			connection
		);

		try {
			await connection.query(updateQuery);
			return message(form, { success: true, message: 'Updated' });
		} catch (e) {
			return message(form, {
				success: false,
				message: 'Something went wrong. Please try again later.'
			});
		}
	}
};
