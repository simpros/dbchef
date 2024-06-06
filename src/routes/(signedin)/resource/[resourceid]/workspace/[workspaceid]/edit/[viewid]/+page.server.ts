import { workspaceViewTable, wsViewRelationTable } from '$db/schema';
import { workspaceViewSchema } from '$lib/components/workspace-view/workspace-view-schema';
import { getConnection } from '$lib/connections';
import { getRelationsOfQuery } from '$lib/pg-utils/chef-relations';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params: { resourceid, viewid }, locals: { db } }) => {
	const workspaceView = await db.query.workspaceViewTable.findFirst({
		where: ({ id }, { eq }) => eq(id, viewid),
		with: {
			relations: true
		}
	});

	if (!workspaceView) {
		return error(404, 'View not found.');
	}

	const resource = getConnection(resourceid);

	if (!resource) {
		return error(400, 'Resource not connected.');
	}

	const relations = workspaceView.detailQuery
		? await getRelationsOfQuery(workspaceView.detailQuery, resource)
		: null;

	return {
		form: await superValidate(
			{
				...workspaceView,
				relations: relations?.map((r) => {
					return {
						columnName: r.column_name,
						providerQuery:
							workspaceView.relations.find((wsvr) => wsvr.columnName === r.column_name)
								?.providerQuery ?? null
					};
				})
			},
			zod(workspaceViewSchema)
		),
		relations
	};
}) satisfies PageServerLoad;

const stringNotNull = <T>(value: T | null): value is T => !!value;

export const actions: Actions = {
	default: async ({ request, params: { viewid }, locals: { db } }) => {
		const form = await superValidate(request, zod(workspaceViewSchema));

		if (!form.valid) return { form };

		const currentRelations = form.data.relations
			.filter((r): r is { providerQuery: string; columnName: string } =>
				stringNotNull(r.providerQuery?.trim())
			)
			.map((r) => ({
				viewId: viewid,
				...r
			}));

		try {
			await db.transaction(async (transaction) => {
				await transaction.delete(wsViewRelationTable).where(eq(wsViewRelationTable.viewId, viewid));
				await transaction.insert(wsViewRelationTable).values(currentRelations);
				await transaction
					.update(workspaceViewTable)
					.set(form.data)
					.where(eq(workspaceViewTable.id, viewid));
			});
			return message(form, { success: true, message: 'View updated successfully.' });
		} catch (error) {
			return message(
				form,
				{ success: false, message: 'Failed to update view. Please try again.' },
				{
					status: 400
				}
			);
		}
	}
};
