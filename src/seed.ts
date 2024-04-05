import { userTable } from '$db/schema/auth';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

const client = new Database('dbchef.sqlite');
const db = drizzle(client);

await db.insert(userTable).values({
	id: generateId(15),
	username: 'admin',
	hashed_password: await new Argon2id().hash('admin')
});
