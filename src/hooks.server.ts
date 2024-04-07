import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const luciaHook: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

const provideDb: Handle = async ({ event, resolve }) => {
	event.locals.db = db;
	return resolve(event);
};

const authCheck: Handle = async ({ event, resolve }) => {
	if (!event.locals.user && event.url.pathname !== '/signin') {
		redirect(307, '/signin');
	}
	if (event.request.method === 'GET' && event.url.pathname === '/') {
		const db = event.locals.db;
		const { length } = await db.query.resourceTable.findMany();
		if (length === 0) {
			redirect(307, '/add-resource');
		} else {
			redirect(307, '/dashboard');
		}
	}
	return resolve(event);
};

export const handle = sequence(luciaHook, provideDb, authCheck);
