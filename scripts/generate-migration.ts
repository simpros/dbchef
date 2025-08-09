import { $ } from 'bun';

await $`bunx drizzle-kit generate --dialect sqlite --schema ./src/lib/server/db/schema/index.ts`;
