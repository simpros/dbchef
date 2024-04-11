import type { PoolClient } from 'pg';

const connections = new Map<string, PoolClient>();

export function addConnection(id: string, pool: PoolClient) {
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
		pool.release();
		connections.delete(id);
	}
}

export function getConnection(id: string) {
	return connections.get(id);
}
