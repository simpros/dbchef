import type { WorkspaceElement } from '$db/schema';
import type { Pool } from 'pg';
import { callElementQuery, type ElementData } from './call-element-query';

export function getElementData(
	elements: WorkspaceElement[],
	parameters: Record<string, unknown>,
	connection: Pool
) {
	return elements.reduce(
		(acc, element) => {
			const elementData = callElementQuery(element, parameters, connection);
			acc[element.id] = elementData;

			return acc;
		},
		{} as Record<string, Promise<ElementData>>
	);
}

export type WorkspaceElementData = ReturnType<typeof getElementData>;
