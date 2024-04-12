import type { Pool } from 'pg';

const connections = new Map<string, Pool>();

export function addConnection(id: string, pool: Pool) {
	const existing = connections.get(id);
	if (existing) {
		return;
	}
	pool.once('end', () => {
		connections.delete(id);
	});
	connections.set(id, pool);
}

export function removeConnection(id: string) {
	const pool = connections.get(id);
	if (pool) {
		pool.end();
		connections.delete(id);
	}
}

export function getConnection(id: string) {
	return connections.get(id);
}
