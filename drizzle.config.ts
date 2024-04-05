import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: 'src/db/schema/*',
	driver: 'libsql',
	out: './drizzle/migrations',
	dbCredentials: {
		url: 'file:./dbchef.sqlite'
	}
});
