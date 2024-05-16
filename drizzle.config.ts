import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: 'src/db/schema/*',
	dialect: 'sqlite',
	out: './drizzle/migrations',
	dbCredentials: {
		url: 'file:./dbchef.sqlite'
	}
});
