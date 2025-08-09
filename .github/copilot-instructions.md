# DBChef Copilot Instructions

## Project Architecture

This is a **SvelteKit + Drizzle ORM** application with session-based authentication using SQLite. The project follows a clean server-client separation pattern:

- **Database Layer**: Drizzle ORM with bun:sqlite (`src/lib/server/db/`)
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

### Form Handling

- **Always use SvelteKit SuperForms** for all form actions and validation
- **Always use ArkType** for form validation schemas in all modules
- Use `superValidate()` in `+page.server.ts` load functions to initialize forms
- Handle form submissions in `+page.server.ts` actions using `superValidate()`
- Integrate with existing form components in `src/lib/components/ui/form/`
- Client-side form state managed through SuperForms stores
- Leverage SuperForms' built-in validation, error handling, and progressive enhancement

### File Organization

```
src/lib/server/     # Server-only code (never sent to client)
src/routes/         # SvelteKit file-based routing
src/hooks.server.ts # Global server middleware
```

### Component Organization

- **Route-specific components**: Place components that are very specific to a route and unlikely to be reused in the route folder alongside the page (e.g., `src/routes/dashboard/dashboard-header.svelte`)
- **Reusable components**: Place in `src/lib/components/` organized by type or domain
- **UI components**: Generic UI components go in `src/lib/components/ui/`

### Schema Organization

- **Always create dedicated schema folders** for validation schemas
- **Form schemas**: Place in dedicated schema folders within the relevant domain (e.g., `src/lib/schemas/auth/`, `src/lib/schemas/user/`)
- **Database schemas**: Keep in `src/lib/server/db/schema/` organized by domain
- **Type definitions**: Co-locate with schemas or in dedicated types files

### Database Queries and Mutations

- **Always organize database operations by feature** in dedicated folders within `src/lib/`
- **Query functions**: Place in feature-specific folders (e.g., `src/lib/queries/auth/`, `src/lib/queries/user/`, `src/lib/mutations/posts/`)
- **Mutation functions**: Organize similarly in dedicated mutation folders by domain
- **Separation of concerns**: Keep queries (read operations) and mutations (write operations) in separate folders for clarity

## Critical Commands

- `bun dev` - Development server with hot reload
- `bun db:push` - Push schema changes to database
- `bun db:generate` - Generate migrations
- `bun db:studio` - Open Drizzle Studio (database GUI)
- `bun check` - TypeScript and Svelte validation

## Integration Points

- **Database**: SQLite via Drizzle ORM, schema-first approach
- **Forms**: SvelteKit SuperForms for all form handling and validation
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
