import { dev } from '$app/environment';
import type { User } from '$db/schema/auth';
import { Lucia } from 'lucia';
import { adapter } from './auth-adapter';

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: User;
	}
}
