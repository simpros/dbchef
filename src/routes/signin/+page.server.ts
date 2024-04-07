import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { signinSchema } from './schema';

const signin = zod(signinSchema);

export const load = (async () => {
	return {
		form: await superValidate(signin)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, signin);
		if (!form.valid) return { form };

		const existingUser = await db.query.userTable.findFirst({
			where: (fields, { eq }) => eq(fields.username, form.data.username)
		});

		if (!existingUser || !existingUser.hashed_password) {
			return setError(form, 'password', 'Username or password is incorrect');
		}

		const correctPassword = await new Argon2id().verify(
			existingUser.hashed_password,
			form.data.password
		);

		if (!correctPassword) {
			return setError(form, 'password', 'Username or password is incorrect');
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
