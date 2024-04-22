import type { WorkspaceView } from '$db/schema';
import type { Pool } from 'pg';
import { callViewQuery } from './call-view-query';

export function getViewData(
	element: WorkspaceView,
	parameters: Record<string, unknown>,
	connection: Pool
) {
	const data = callViewQuery(element, parameters, connection);
	return { ...element, data };
}

export type WorkspaceViewData = ReturnType<typeof getViewData>;
