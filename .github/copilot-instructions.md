# DBChef Copilot Instructions

## Project Architecture

This is a **SvelteKit + Drizzle ORM** application with session-based authentication using SQLite. The project follows a clean server-client separation pattern:

- **Database Layer**: Drizzle ORM with better-sqlite3 (`src/lib/server/db/`)
- **Auth Layer**: Custom session-based auth with SHA256 token hashing (`src/lib/server/auth.ts`)
- **Server Hooks**: Authentication middleware in `src/hooks.server.ts`
- **Frontend**: Svelte 5 with TailwindCSS v4

## Key Development Patterns

### Database Operations

- Schema defined in `src/lib/server/db/schema.ts` using Drizzle SQLite syntax
- Database instance exported from `src/lib/server/db/index.ts`
- Use `pnpm db:push` to sync schema changes, `pnpm db:studio` for GUI
- Environment requires `DATABASE_URL` (defaults to `local.db`)

### Authentication Flow

- Session tokens are Base64url encoded, stored as SHA256 hashes in DB
- Authentication state available via `event.locals.user` and `event.locals.session`
- Cookie management handled automatically by auth utilities
- Session auto-renewal happens 15 days before expiration

### File Organization

```
src/lib/server/     # Server-only code (never sent to client)
src/routes/         # SvelteKit file-based routing
src/hooks.server.ts # Global server middleware
```

## Critical Commands

- `pnpm dev` - Development server with hot reload
- `pnpm db:push` - Push schema changes to database
- `pnpm db:generate` - Generate migrations
- `pnpm db:studio` - Open Drizzle Studio (database GUI)
- `pnpm check` - TypeScript and Svelte validation

## Integration Points

- **Database**: SQLite via Drizzle ORM, schema-first approach
- **Styling**: TailwindCSS v4 with Vite plugin integration
- **Type Safety**: Full TypeScript with Svelte type inference
- **Auth Context**: Available in all server-side code via `event.locals`

## Project-Specific Conventions

- Server-side code strictly in `src/lib/server/` to prevent client leakage
- Environment variables accessed via `$env/dynamic/private` for server code
- Session validation returns `{ session, user }` tuple pattern
- Database operations use Drizzle's query builder, not raw SQL
- All auth utilities expect `RequestEvent` parameter for cookie handling

## Common Workflows

When adding new features:

1. Define schema changes in `schema.ts`
2. Run `pnpm db:push` to apply changes
3. Update type definitions if needed (`app.d.ts`)
4. Implement server logic in `src/lib/server/`
5. Create routes with `+page.svelte` and optional `+page.server.ts`

When debugging auth issues, check session cookie presence and validation in browser dev tools.
