import { getConnection } from '$lib/connections';
import { getFieldTypesForForm } from '$lib/pg-utils/converter/db-to-form';
import { parseUpdateChefQuery } from '$lib/pg-utils/parse-chef-query';
import { error, fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { generateDetailSchema } from './detail-schema';
import { getDetailData } from './get-detail-data';
import { parseFormValuesFromRow } from './parse-form-values';

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

	const form = await superValidate(parseFormValuesFromRow(row, types), zod(schema), {
		id: 'detail'
	});

	return { form, types, readonly: !view.updateQuery };
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

		if (!view.detailQuery || !view.updateQuery) {
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
			view.updateQuery,
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
