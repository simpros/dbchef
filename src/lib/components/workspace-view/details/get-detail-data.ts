import type { WorkspaceView } from '$db/schema';
import type { Pool } from 'pg';
import { callDetailQuery } from './call-detail-query';

export function getDetailData(
	element: WorkspaceView,
	parameters: Record<string, unknown>,
	connection: Pool
) {
	const data = callDetailQuery(element, parameters, connection);
	return { ...element, data };
}

export type DetailData = ReturnType<typeof getDetailData>;
